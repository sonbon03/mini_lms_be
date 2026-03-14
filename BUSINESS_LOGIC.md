# Business Logic - Đăng ký lớp học

Toàn bộ logic xử lý nằm trong file:

```
src/modules/registrations/registrations.service.ts
```

---

## 1. Đăng ký lớp (POST /api/classes/:classId/register)

Method: `register()` — line 28–106

Tất cả validation chạy trong **1 transaction** để đảm bảo data consistency.

---

### Check 1: Kiểm tra sĩ số (line 47–53)

```typescript
// Check 1: Max students
const currentCount = await manager.count(ClassRegistration, {
  where: { class_id: classId },
});
if (currentCount >= cls.max_students) {
  throw new BadRequestException('Class is full');
}
```

**Logic:** Đếm số registration hiện tại của lớp → so sánh với `max_students` → reject nếu đã đầy.

**Error:** `400 - Class is full`

---

### Check 2: Kiểm tra trùng lịch (line 65–80)

```typescript
// Check 2: Schedule conflict
const studentRegistrations = await manager.find(ClassRegistration, {
  where: { student_id: dto.student_id },
  relations: ['classEntity'],
});

for (const reg of studentRegistrations) {
  if (
    reg.classEntity.day_of_week === cls.day_of_week &&
    this.hasTimeOverlap(reg.classEntity.time_slot, cls.time_slot)
  ) {
    throw new BadRequestException(
      `Schedule conflict with class "${reg.classEntity.name}" on ${cls.day_of_week} at ${reg.classEntity.time_slot}`,
    );
  }
}
```

**Logic:**
1. Lấy tất cả lớp mà student đã đăng ký
2. Lọc các lớp có cùng `day_of_week`
3. So sánh `time_slot` overlap bằng helper `hasTimeOverlap()`

**Thuật toán overlap (line 148–161):**

```typescript
private hasTimeOverlap(slot1: string, slot2: string): boolean {
  const parse = (slot: string) => {
    const [start, end] = slot.split('-');
    return {
      start: this.timeToMinutes(start!),
      end: this.timeToMinutes(end!),
    };
  };

  const a = parse(slot1);
  const b = parse(slot2);

  return a.start < b.end && b.start < a.end;
}
```

Ví dụ: `"08:00-09:30"` và `"09:00-10:30"` → overlap vì `08:00 < 10:30 && 09:00 < 09:30`

**Error:** `400 - Schedule conflict with class "Toan Nang Cao" on mon at 08:00-09:30`

---

### Check 3: Kiểm tra gói học (line 82–96)

```typescript
// Check 3: Active subscription
const today = new Date().toISOString().split('T')[0]!;
const subscriptions = await manager.find(Subscription, {
  where: { student_id: dto.student_id },
});

const activeSub = subscriptions.find(
  (s) => s.expiry_date >= today && s.used_sessions < s.total_sessions,
);

if (!activeSub) {
  throw new BadRequestException('Student has no active subscription');
}
```

**Logic:** Tìm subscription thỏa 2 điều kiện:
- `expiry_date >= today` — chưa hết hạn
- `used_sessions < total_sessions` — còn buổi học

**Error:** `400 - Student has no active subscription`

---

## 2. Hủy đăng ký có điều kiện (DELETE /api/registrations/:id)

Method: `remove()` — line 108–146

```
src/modules/registrations/registrations.service.ts
```

---

### Logic hủy + hoàn buổi

```typescript
// Calculate next class datetime
const now = new Date();
const nextClassDate = this.getNextClassDate(
  reg.classEntity.day_of_week,
  reg.classEntity.time_slot,
);

const hoursUntilClass =
  (nextClassDate.getTime() - now.getTime()) / (1000 * 60 * 60);

let refunded = false;

if (hoursUntilClass > 24) {
  // > 24h before class: refund 1 session
  const activeSub = subscriptions.find(
    (s) => s.expiry_date >= today && s.used_sessions > 0,
  );

  if (activeSub) {
    activeSub.used_sessions -= 1;
    await manager.save(Subscription, activeSub);
    refunded = true;
  }
}

await manager.remove(ClassRegistration, reg);
```

**Logic:**
1. Tính thời gian buổi học kế tiếp dựa trên `day_of_week` + `time_slot`
2. So sánh với thời điểm hiện tại:

| Điều kiện | Hành động | Response |
|-----------|-----------|----------|
| Hủy **trước > 24h** | Xóa đăng ký + `used_sessions -= 1` | `{ refunded: true, message: "...1 session refunded." }` |
| Hủy **sát giờ ≤ 24h** | Chỉ xóa đăng ký, không hoàn buổi | `{ refunded: false, message: "...No refund..." }` |

**Response 200:**

```json
{
  "refunded": true,
  "message": "Registration cancelled. 1 session refunded."
}
```

```json
{
  "refunded": false,
  "message": "Registration cancelled. No refund (less than 24h before class)."
}
```

---

## Tổng quan flow

```
Student đăng ký lớp
    │
    ├── Lớp đầy?                    → 400: Class is full
    ├── Trùng lịch cùng ngày/giờ?   → 400: Schedule conflict
    ├── Không có gói học active?     → 400: No active subscription
    │
    └── OK → Tạo ClassRegistration

Student hủy đăng ký
    │
    ├── > 24h trước giờ học  → Xóa + hoàn 1 buổi (used_sessions -= 1)
    └── ≤ 24h trước giờ học  → Xóa, không hoàn buổi
```

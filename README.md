# Mini LMS Backend

## Tech Stack
- NestJS + TypeORM + PostgreSQL
- Swagger API Docs

## Setup

```bash
yarn install
```

## Run

```bash
# development
yarn start:dev

# production
yarn build && yarn start:prod

# docker
docker-compose up
```

## Environment Variables

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5434/mini_lms
PORT=3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/parents | Tạo phụ huynh |
| GET | /api/parents | Danh sách phụ huynh |
| GET | /api/parents/:id | Xem phụ huynh + học sinh |
| POST | /api/students | Tạo học sinh |
| GET | /api/students | Danh sách học sinh |
| GET | /api/students/:id | Xem học sinh + phụ huynh |
| POST | /api/classes | Tạo lớp học |
| GET | /api/classes?day=mon | Lọc lớp theo ngày |
| POST | /api/classes/:classId/register | Đăng ký học sinh vào lớp |
| DELETE | /api/registrations/:id | Hủy đăng ký |
| POST | /api/subscriptions | Tạo gói học |
| GET | /api/subscriptions | Danh sách gói học |
| GET | /api/subscriptions/:id | Xem trạng thái gói |
| PATCH | /api/subscriptions/:id/use | Dùng 1 buổi học |

## Swagger

http://localhost:8080/api/docs

```markdown
# Doodle Chat - Backend Service

## Overview
RESTful API for a chat application with token-based authentication.

## Tech Stack
- Backend: Node.js 20, Express 5.x, PostgreSQL 15
- Frontend: React + Next.js + TypeScript + GraphQL + MUI
- Containerization: Docker 24.0+, Docker Compose
- Validation: Zod schema validation
- Authentication: Bearer token

## Prerequisites
- Docker 24.0+
- Node.js 20.x

## Development Workflow
# 1. Clone repository
git clone git@github.com:osmancalisir/doodle.git
cd doodle/backend

# 2. Install dependencies
yarn install

# 3. Start the system
docker-compose up --build

# 4. Apply schema migrations inside backend folder
docker-compose -f docker-compose.yml run app npm run migrate
--passport: postgres

# 5. Access services:
#   - API: http://localhost:4000
#   - Database: localhost:5432

## API Endpoints
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/v1/messages` | GET | Retrieve chat messages | `?after=<timestamp>&limit=50` |
| `/api/v1/messages` | POST | Send new message | `{ message: string, author: string }` |
| `/health` | GET | System diagnostics | - |

## Testing
```bash
# Test authentication
curl -H "Authorization: Bearer doodle-token" http://localhost:4000/health

# Send message
curl -X POST http://localhost:4000/api/v1/messages \
  -H "Authorization: Bearer doodle-token" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Doodle!", "author": "Osman Calisir"}'

# Get messages
curl -H "Authorization: Bearer doodle-token" http://localhost:4000/api/v1/messages
```

## Key Components
| Component | Responsibility |
|-----------|----------------|
| `messages` table | Stores chat messages with timestamps |
| Authentication | Bearer token verification for all endpoints |
| Pagination | `after` and `limit` parameters for message history |
| Health Check | Database and API status monitoring |

## Environment Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `db` | Database hostname (use `localhost` outside Docker) |
| `DB_PORT` | `5432` | Database port |
| `DB_USER` | `doodle` | Database username |
| `DB_NAME` | `doodlebackend` | Database name |
| `CHAT_TOKEN` | - | Authentication token (generate with `yarn generate-token`) |
| `NODE_ENV` | `development` | Runtime environment |

## Deployment
```bash
# Production build
docker-compose -f docker-compose.yml up --build -d

# Stop services
docker-compose down

# Regenerate token
yarn generate-token
```

## Frontend Connection
Configure frontend to use:
```env
API_URL=http://localhost:4000/api/v1/messages
AUTH_TOKEN=doodle-token
```

## Database Schema
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Sample Data
```sql
INSERT INTO messages (message, author) VALUES
('Hello everyone!', 'David'),
('How are you doing?', 'Joel'),
('Working on the chat app!', 'Shannon');
```

## Troubleshooting
1. **Database not starting**:
   - Check disk space: `docker system df`
   - Reset containers: `docker-compose down -v`

2. **Authentication failures**:
   - Verify token matches in `.env` and `docker-compose.yml`
   - Check header format: `Authorization: Bearer <token>`

3. **Migration issues**:
   - Verify migration file exists in `db/migrations`
   - Check file permissions: `chmod +x db/init.sh`
```

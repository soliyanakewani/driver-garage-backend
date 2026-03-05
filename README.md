# driver-garage-backend

Backend for driver assistant project — **Node.js + Express + TypeScript + Prisma**, organized with **Clean Architecture** and **feature-first modules**.

---

## Top-Level Layout

- **`src/`**: All application source code  
- **`prisma/`**: (Optional) External tooling & migration scripts entrypoint, proxied from module-level Prisma (no schema here; real schema lives in module infrastructure)  
- **`tests/`**: Automated tests (unit, integration, e2e)  
- **`scripts/`**: DevOps, seeders, and automation scripts (no business logic)  
- **`docs/`**: Architecture and API documentation  
- **`package.json`**, **`tsconfig.json`**, **`.env.example`**, etc.: Tooling and configuration only

---

## `src/` Structure

```
src/
├── core/                     # Core application setup & cross-cutting infrastructure
│   ├── app/                  # Express app composition (no business logic)
│   │   ├── http/             # HTTP-specific glue (Express instance, routers, server)
│   │   ├── middleware/       # Global middleware registration (attaching shared/core middleware)
│   │   └── loaders/          # Startup loaders (DB, cache, queues, telemetry, etc.)
│   ├── config/               # Environment, config objects, and typed configuration
│   │   ├── env/              # Env variable parsing & validation (zod/joi-like)
│   │   ├── security/         # Security-related config (CORS, rate limit, JWT, etc.)
│   │   └── services/         # Third-party service configs (email, payments, sms, etc.)
│   ├── middleware/           # Core reusable middleware (auth, validation, error, logging)
│   │   ├── auth/             # JWT verification, role guards, session extraction
│   │   ├── validation/       # Request validation adapters (e.g. zod/joi/celebrate)
│   │   ├── error/            # Centralized error handler, not-found handler
│   │   └── logging/          # Request logging, correlation IDs, performance tracing
│   ├── http/                 # Shared HTTP-level contracts/utilities
│   │   ├── base-controllers/ # Base controller classes, common handler patterns
│   │   ├── responses/        # Response formatter, envelope types, pagination helpers
│   │   └── routing/          # Route registration helpers, versioning, prefixing
│   ├── logging/              # Logger setup (e.g. pino/winston) + structured logging helpers
│   ├── errors/               # Custom error classes (DomainError, AppError, HttpError, etc.)
│   ├── security/             # Core security utilities (password hashing, token helpers)
│   └── index.ts              # Core module entrypoint (exports app bootstrap helpers)
│
├── shared/                   # Pure, framework-agnostic shared code (no Express/Prisma)
│   ├── dto/                  # Common DTOs used across modules (e.g. pagination, filters)
│   ├── enums/                # Shared enums (roles, statuses, types)
│   ├── types/                # Global TS types & interfaces shared between modules
│   ├── utils/                # Generic utilities (guards, formatters, mappers)
│   ├── constants/            # Global constants (e.g. role names, limits, feature flags)
│   ├── value-objects/        # Cross-module value objects (Email, Phone, Money, etc.)
│   └── time/                 # Date/time helpers, timezones, scheduling helpers
│
├── main/                     # Application entrypoints and wiring (no business logic)
│   ├── server.ts             # HTTP server bootstrap (reads config, starts Express)
│   ├── routes.ts             # Root router that assembles all module routes
│   ├── container.ts          # Dependency injection wiring, bindings between layers
│   └── index.ts              # Main app entry, picks env & mode, etc.
│
├── modules/                  # Feature-based modules organized by actor (Admin, Driver, Garage)
│   │
│   ├── admin/                # Admin module - feature-based structure
│   │   ├── auth/             # Admin authentication (login, logout, register)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── garageApproval/   # Garage approval management (pending, approve, reject)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── education/       # Education content management (CRUD operations)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── userManagement/  # User management (list, search, warn, block)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── communityModeration/ # Community moderation (reported posts, delete posts)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── settings/         # Admin settings (profile, change password)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   └── notifications/    # Admin notifications
│   │       ├── presentation/{routes,controllers,validators}
│   │       ├── application/{usecases,dto}
│   │       ├── domain/{entities,repositories}
│   │       └── infrastructure/{prisma,repositories,mappers}
│   │
│   ├── driver/               # Driver module - feature-based structure
│   │   ├── auth/             # Driver authentication (signup, login, logout, OTP)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── profile/          # Driver profile management (CRUD)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── vehicles/         # Vehicle management (CRUD operations)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── maintenance/      # Maintenance & reminders management
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── appointments/     # Appointment booking & management (book, list, cancel, reschedule)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── education/        # Education center (browse content, search)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── community/        # Community features (posts, comments, likes, bookmarks, reports)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── serviceLocator/   # Service locator (nearby services, filters, navigation)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── aiAssistant/      # AI assistant (chat, chat history)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── onsiteAssistance/ # On-site assistance requests
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── ratings/          # Ratings & reviews (rate services)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── settings/         # Driver app settings
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   └── notifications/    # Driver notifications
│   │       ├── presentation/{routes,controllers,validators}
│   │       ├── application/{usecases,dto}
│   │       ├── domain/{entities,repositories}
│   │       └── infrastructure/{prisma,repositories,mappers}
│   │
│   ├── garage/               # Garage module - feature-based structure
│   │   ├── auth/             # Garage authentication (signup, login, logout, OTP)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── profile/          # Garage profile management
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── appointments/     # Appointment management (list, approve, reject)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── services/         # Service management (status, history)
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── notifications/    # Garage notifications
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   ├── settings/         # Garage settings
│   │   │   ├── presentation/{routes,controllers,validators}
│   │   │   ├── application/{usecases,dto}
│   │   │   ├── domain/{entities,repositories}
│   │   │   └── infrastructure/{prisma,repositories,mappers}
│   │   └── ratings/          # Ratings & reviews (view ratings)
│   │       ├── presentation/{routes,controllers,validators}
│   │       ├── application/{usecases,dto}
│   │       ├── domain/{entities,repositories}
│   │       └── infrastructure/{prisma,repositories,mappers}
│   │
│   ├── auth/                 # Cross-actor authentication & authorization module (shared)
│   │   ├── presentation/{routes,controllers,validators}
│   │   ├── application/{usecases,dto}
│   │   ├── domain/{entities,repositories}
│   │   └── infrastructure/{prisma,repositories,mappers}
│   │
│   └── notifications/        # Cross-cutting notifications (in-app, email, push)
│       ├── presentation/     # Optional HTTP endpoints for notification center
│       ├── application/      # Use cases sending notifications (triggered by events)
│       ├── domain/           # Notification entities and repository interfaces
│       └── infrastructure/   # Providers (email/SMS/push) and persistence impls
│
└── infrastructure/           # Global infrastructure that spans modules
    ├── prisma/               # Central Prisma client & connection management
    │   ├── client/           # PrismaClient singleton factory, connection helpers
    │   ├── migrations/       # Database migrations (generated/applied by Prisma CLI)
    │   ├── seeds/            # Global seed scripts (bootstrap minimal data)
    │   └── index.ts          # Exports typed Prisma client to module infra adapters
    ├── cache/                # Caching layer (Redis, in-memory cache, abstractions)
    ├── messaging/            # Message brokers (e.g. Kafka, RabbitMQ, Redis Streams)
    ├── http-clients/         # External HTTP client wrappers (third-party APIs)
    ├── storage/              # File/object storage adapters (S3, GCS, etc.)
    └── telemetry/            # Monitoring, metrics, tracing, health checks
```

---

## Architecture Rules

- **Presentation → Application → Domain → Infrastructure**  
  - Presentation depends on Application DTOs/use cases.  
  - Application depends on Domain entities and repository **interfaces**.  
  - Infrastructure implements repository interfaces but is not depended on by Domain.  
- **No direct Prisma usage** in controllers or use cases  
  - Only code in `modules/*/infrastructure/repositories` and `infrastructure/prisma` uses Prisma.  
- **Auth & roles (ADMIN, DRIVER, GARAGE)**  
  - Handled centrally via `auth` module and `core/middleware/auth` with shared role enums in `shared/enums`.  

---

## Core Modules & Features

### Admin Module
| Feature | Endpoints | Responsibility |
|--------|-----------|----------------|
| **auth** | `POST /admin/auth/login`, `POST /admin/auth/logout`, `POST /admin/auth/register` | Admin authentication |
| **garageApproval** | `GET /admin/garages/pending`, `POST /admin/garages/{id}/approve`, `POST /admin/garages/{id}/reject` | Garage approval management |
| **education** | `GET/POST/PUT/DELETE /admin/education` | Education content management |
| **userManagement** | `GET /admin/users`, `POST /admin/users/{id}/warn`, `POST /admin/users/{id}/block` | User management & moderation |
| **communityModeration** | `GET /admin/posts/reported`, `DELETE /admin/posts/{id}` | Community content moderation |
| **settings** | `GET/PUT /admin/profile`, `PUT /admin/profile/change-password` | Admin profile & settings |
| **notifications** | `GET /admin/notifications` | Admin notifications |

### Driver Module
| Feature | Endpoints | Responsibility |
|--------|-----------|----------------|
| **auth** | `POST /drivers/auth/signup`, `POST /drivers/auth/login`, `POST /drivers/auth/send-otp`, `POST /drivers/auth/verify-otp` | Driver authentication with OTP |
| **profile** | `GET/POST/PUT /driver/profile` | Driver profile management |
| **vehicles** | `GET/POST/PUT/DELETE /driver/vehicles` | Vehicle CRUD operations |
| **maintenance** | `GET/POST /driver/maintenance`, `GET/POST /driver/reminders` | Maintenance & reminders |
| **appointments** | `POST/GET /driver/appointments`, `PUT /driver/appointments/{id}/cancel`, `PUT /driver/appointments/{id}/reschedule` | Appointment booking & management |
| **education** | `GET /education/content` | Education center access |
| **community** | `POST/GET/PUT/DELETE /community/posts`, `POST /community/posts/{id}/like`, `POST /community/posts/{id}/bookmark` | Community posts, comments, likes, bookmarks |
| **serviceLocator** | `GET /services/nearby`, `GET /services/{serviceId}` | Service discovery & navigation |
| **aiAssistant** | `POST /ai/chat`, `GET /ai/chats` | AI chat assistant |
| **onsiteAssistance** | `POST /driver/onsite-assistance` | On-site assistance requests |
| **ratings** | `POST /services/{serviceId}/rating` | Service ratings & reviews |
| **settings** | `GET/PUT /driver/settings` | Driver app settings |
| **notifications** | `GET /driver/notifications`, `PUT /driver/notifications/{id}/read` | Driver notifications |

### Garage Module
| Feature | Endpoints | Responsibility |
|--------|-----------|----------------|
| **auth** | `POST /garages/auth/signup`, `POST /garages/auth/login`, `POST /garages/auth/send-otp`, `POST /garages/auth/verify-otp` | Garage authentication with OTP |
| **profile** | `GET/PUT /garage/profile` | Garage profile management |
| **appointments** | `GET /garage/appointments`, `PUT /garage/appointments/{id}/approve`, `PUT /garage/appointments/{id}/reject` | Appointment management |
| **services** | `PUT /garage/services/{id}/status`, `GET /garage/services/history` | Service status & history |
| **notifications** | `GET /garage/notifications` | Garage notifications |
| **settings** | `GET/PUT /garage/settings` | Garage settings |
| **ratings** | `GET /garage/ratings`, `GET /garage/ratings/{id}` | View ratings & reviews |

### Shared Modules
| Module | Responsibility |
|--------|----------------|
| **auth** | Cross-actor authentication & authorization (JWT, roles, sessions) - shared utilities |
| **notifications** | In-app, email, and push notifications - shared infrastructure |

---

## Run

```bash
npm install
npm run dev
```

Default: `http://localhost:4000`.

---

## Documentation

- **[Code Conventions](./docs/CODE_CONVENTIONS.md)**: Comprehensive coding standards, naming conventions, and best practices for the project.

---

> **Note**: This README defines the **folder structure and responsibilities**.  
> Actual implementation code and Prisma schema will be created later following this layout.

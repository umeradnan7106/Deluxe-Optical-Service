# API Contract: Authentication (`/api/auth`)

**Base URL**: `http://localhost:8000`
**Auth header**: `Authorization: Bearer <access_token>` (required routes only)

All responses follow the standard envelope:
```json
// Success: { "data": {...}, "message": "success" }
// Error:   { "detail": "Error message" }
```

---

## POST /api/auth/register

**Purpose**: Create a new customer account and return tokens.

**Request body**:
```json
{
  "full_name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "phone": "03001234567",
  "password": "minEight1"
}
```

**Validation**:
- `email`: valid format, not already registered
- `password`: minimum 8 characters

**Response 201**:
```json
{
  "data": {
    "access_token": "<jwt>",
    "refresh_token": "<jwt>",
    "user": { "id": 1, "full_name": "Ahmed Khan", "email": "ahmed@example.com", "is_admin": false }
  },
  "message": "success"
}
```

**Side effects**: Welcome email sent via BackgroundTasks.

**Errors**: `400` email already registered | `422` validation error

---

## POST /api/auth/login

**Request body**: `{ "email": "...", "password": "..." }`

**Response 200**: Same as register response (tokens + user).

**Errors**: `401` invalid credentials

---

## POST /api/auth/refresh

**Request body**: `{ "refresh_token": "<jwt>" }`

**Response 200**: `{ "data": { "access_token": "<new_jwt>" }, "message": "success" }`

**Errors**: `401` invalid or expired refresh token

---

## POST /api/auth/forgot-password

**Request body**: `{ "email": "ahmed@example.com" }`

**Response 200**: `{ "data": null, "message": "Reset link sent if email exists" }`
(Always returns 200 to prevent email enumeration.)

**Side effects**: Password reset email sent via BackgroundTasks (token valid 1 hour).

---

## POST /api/auth/reset-password

**Request body**: `{ "token": "<reset_token>", "new_password": "newPass123" }`

**Response 200**: `{ "data": null, "message": "Password updated" }`

**Errors**: `400` invalid or expired token | `422` validation error

---

## GET /api/auth/me

**Auth**: Required

**Response 200**: `{ "data": { "id": 1, "full_name": "...", "email": "...", "phone": "...", "is_admin": false } }`

---

## PUT /api/auth/me

**Auth**: Required

**Request body**: `{ "full_name": "...", "phone": "..." }` (email not updatable here for security)

**Response 200**: Updated user object.

---

## PUT /api/auth/change-password

**Auth**: Required

**Request body**: `{ "current_password": "...", "new_password": "..." }`

**Response 200**: `{ "data": null, "message": "Password changed" }`

**Errors**: `401` current password incorrect

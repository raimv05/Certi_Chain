# API Documentation

## Authentication

### `POST /api/auth/register`
Create an admin user.

Request body:
```json
{
  "name": "Platform Admin",
  "email": "admin@example.com",
  "password": "StrongPassword123!",
  "role": "super_admin",
  "organizationId": "org-001",
  "walletAddress": "0x1234..."
}
```

### `POST /api/auth/login`
Authenticate an admin and receive a JWT.

## Certificates

### `POST /api/certificates`
Protected endpoint to issue a single certificate.

Form-data fields:
- `candidateName`
- `courseName`
- `issuerName`
- `issueDate`
- `notes`
- `file` (`.pdf` or `.json`)

### `POST /api/certificates/bulk`
Protected endpoint to bulk issue certificates from CSV.

CSV columns:
- `candidateName`
- `courseName`
- `issuerName`
- `issueDate`

### `GET /api/certificates`
List certificates for the authenticated organization.

### `PATCH /api/certificates/:certificateId/revoke`
Revoke a certificate on-chain and in MongoDB.

### `GET /api/certificates/verify/:certificateId`
Public verification by certificate ID.

### `POST /api/certificates/verify/file`
Public verification by uploaded original file.

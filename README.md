# Pharmacy Ordering Website

Full-stack pharmacy ordering project built for hackathon/interview demos.

## Stack

- Backend: ASP.NET Core Web API (.NET 10), EF Core, SQL Server, JWT, Swagger, repository/service pattern
- Frontend: Angular 21, Bootstrap 5, routing, guards, interceptor, reactive forms
- Security: BCrypt password hashing, Bearer token auth, role-based authorization, CORS, IP rate limiting

## Modules

- Authentication: register, login, JWT, logout, admin/customer roles
- Medicines: list, details, search, category filter, admin CRUD
- Categories: list and admin create API
- Prescriptions: upload with `IFormFile`, saved under `wwwroot/uploads`, admin approve/reject
- Cart: add, remove, update quantity
- Orders: checkout, order history, quick reorder, admin status updates
- Inventory: stock is reduced when an order is confirmed
- Stretch: SMTP-ready email service, loyalty/health package data models and wellness endpoints

## Run Backend

```bash
cd PharmacyAPI
dotnet restore
dotnet ef database update
dotnet run
```

Swagger opens at:

```text
http://localhost:5078/swagger
```

The default SQL Server connection string uses LocalDB in `PharmacyAPI/appsettings.json`.

## Run Frontend

```bash
cd pharmacy-ui
npm install
npm start
```

Angular runs at:

```text
http://localhost:4200
```

The API base URL is configured in `pharmacy-ui/src/app/services/api.config.ts`.

## Demo Flow

1. Register a customer and browse medicines.
2. Upload a prescription for prescription medicines.
3. Register an admin account by selecting `Admin`.
4. Approve the prescription from Admin > Prescriptions.
5. Add medicines to cart and checkout.
6. Confirm the order from Admin > Orders to trigger inventory reduction.

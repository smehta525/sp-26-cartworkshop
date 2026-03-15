# Migration Plan: InMemory → SQLite

## Why

The EF Core InMemory provider does not support the database migrations, does not persist data between app restarts, and does not enforce relational constraints (foreign keys, unique indexes, column types). Switching to SQLite gives us a real relational database for development while staying lightweight and zero-config.

## Current State

| Item         | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| Provider     | `Microsoft.EntityFrameworkCore.InMemory` (v10.0.3)             |
| Registration | `options.UseInMemoryDatabase("MarketplaceDb")` in `Program.cs` |
| Seed data    | `HasData()` in `MarketplaceContext.OnModelCreating`            |
| DB file      | none (in-process memory)                                       |

## Change Plan

### 1. Swap NuGet package

- **Remove** `Microsoft.EntityFrameworkCore.InMemory`
  - `dotnet remove package Microsoft.EntityFrameworkCore.InMemory`
- **Add** `Microsoft.EntityFrameworkCore.Sqlite` (same major version)
  - `dotnet add package Microsoft.EntityFrameworkCore.Sqlite`

There is no need to install SQLite, as the EF Core provider includes the necessary native libraries for local development. The database will be stored in a local file (`marketplace.db`) created automatically by EF Core when the app runs.

There are many SQLite GUI tools available for inspecting the database file, such as [DB Browser for SQLite](https://sqlitebrowser.org/) or the [SQLite extension for VS Code](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite).

### 2. Update `Program.cs`

Replace the `UseInMemoryDatabase` call with `UseSqlite`, pointing at a local file:

```csharp
builder.Services.AddDbContext<MarketplaceContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 3. Add connection string to `appsettings.Development.json`

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=marketplace.db"
}
```

### 4. Keep seed-data strategy

`EnsureCreated()` in `Program.cs` will continue to create tables and seed data from `HasData()`. No EF migrations are needed for this step.

### 5. Git-ignore the database file

Add `*.db` to the backend `.gitignore` so the local SQLite file is not committed.

## Files Changed

| File                                   | Change                          |
| -------------------------------------- | ------------------------------- |
| `backend/backend.csproj`               | Swap InMemory → Sqlite package  |
| `backend/Program.cs`                   | `UseSqlite(connectionString)`   |
| `backend/appsettings.Development.json` | Add `ConnectionStrings` section |
| `backend/.gitignore`                   | Add `*.db`                      |

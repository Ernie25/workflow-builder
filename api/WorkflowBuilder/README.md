# Workflow Builder API

An AI-powered workflow builder using Clean Architecture with ASP.NET Core 9.0 and MongoDB.

## Quick Start

### 1. Setup Database

Create a `.env` file in the project root:

```env
MONGO_ROOT_USERNAME=workflowbuilder
MONGO_ROOT_PASSWORD=workflowbuilder123
MONGO_DATABASE=workflowbuilder
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=admin123
```

Start MongoDB and Mongo Express:

```bash
docker-compose up -d
```

### 2. Run the API

```bash
dotnet run --project src/WorkflowBuilder.Api
```

The API will be available at `https://localhost:5001` (or check console output).

API documentation is available at `/scalar/v1` endpoint.

### Prerequisites

- .NET 9.0 SDK

### Useful Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f mongodb

# Access MongoDB shell
docker exec -it wb-mongodb mongosh

# Run tests
dotnet test

# Build solution
dotnet build
```

### Access Points

- **MongoDB**: `localhost:27017`
- **Mongo Express** (Web UI): `http://localhost:8081`

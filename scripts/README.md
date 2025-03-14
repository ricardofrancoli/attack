# API Testing Strategy

This document outlines the approach for running the scripts in order to run the Audit API functionality.

## Prerequisites

1. Ensure MongoDB is running locally. Your actual command may vary:
   ```bash
   # On macOS (with brew)
   brew services start mongodb # or mongodb-community

    # On Linux
   systemctl start mongodb

   # On Windows (if installed as a service)
   net start MongoDB
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Test Environment Setup

The application uses a separate test database to avoid interfering with development data:

```bash
# Start the server in test mode
pnpm run start:test
```

This runs the server with `NODE_ENV=test`, connecting to the `attack-test` database.

## Testing API Endpoints

### Option 1: Run Individual Test Scripts

Each script:
1. Loads sample data
2. Performs the API operation
3. Displays the results

```bash
# Test retrieving all audit entries
pnpm run test:audit:getAll

# Test retrieving a specific audit entry
pnpm run test:audit:getOne

# Test deleting an audit entry
pnpm run test:audit:deleteOne
```

### Option 2: Run Complete Test Suite

For convenience, run all tests in sequence:

```bash
pnpm run test:audit
```

## Expected Results

### GET /audit
- Returns an array of audit entries
- Each entry should have an `_id` and `x` and `y` coordinates

### GET /audit/:id
- Returns a single audit entry with complete details
- Should match the format of entries from the `getAll` endpoint

### DELETE /audit/:id
- Removes the specified entry
- Returns confirmation of deletion

## Manual Verification (Optional)

To verify data persistence, you can:

1. Use MongoDB Compass to connect to `mongodb://localhost:27017/attack-test`
2. Examine the audit collection to verify operations had the expected effect

## Limitations and Future Improvements

Given the time constraints, this testing strategy focuses on basic functionality. In a production environment, additional tests would include:

- Proper mock or test db
- Invalid input handling
- Performance testing

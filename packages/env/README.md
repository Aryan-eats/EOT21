# @eatontime/env

Environment configuration utilities for EatOnTime projects.

## Overview

This package provides utilities for loading and validating environment variables using Zod schemas. It integrates with `dotenv-safe` to ensure all required environment variables are set.

## Usage

### Installation

```bash
pnpm add @eatontime/env
```

### Loading and Validating Environment Variables

```typescript
import { loadBackendEnv } from '@eatontime/env';

// Load environment variables from .env file and validate them
const env = loadBackendEnv();

// Use the validated environment variables
console.log(`Server running on port ${env.PORT}`);
```

### Available Loaders

- `loadBackendEnv()`: Load and validate backend environment variables
- `loadFrontendEnv()`: Load and validate frontend environment variables
- `loadAdminDashEnv()`: Load and validate admin dashboard environment variables
- `loadRestaurantDashEnv()`: Load and validate restaurant dashboard environment variables

### Custom Environment Schema

You can also use your own Zod schema to validate environment variables:

```typescript
import { loadEnv } from '@eatontime/env';
import { z } from 'zod';

const mySchema = z.object({
  MY_CUSTOM_VAR: z.string(),
  // other variables...
});

const env = loadEnv(mySchema, {
  basePath: process.cwd(),
  envFilePath: '.env.local',
  examplePath: '.env.example',
});
```

## Development

### Building

```bash
pnpm run build
```

### Linting

```bash
pnpm run lint
```

## License

MIT

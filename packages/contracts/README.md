# @eatontime/contracts

Shared type definitions and contracts for the EatOnTime ecosystem.

## Overview

This package contains TypeScript type definitions, interfaces, and Zod schemas that are shared across the EatOnTime applications. It establishes a common contract between frontend and backend services, ensuring type safety and consistency.

## Usage

### Installation

```bash
pnpm add @eatontime/contracts
```

### Importing Types

```typescript
import { Restaurant, Product, Client, AuthTokens } from '@eatontime/contracts';

// Example usage
const restaurant: Restaurant = {
  id: '1',
  name: 'Pizza Palace',
  // ...other properties
};
```

### Available Type Definitions

- **Restaurant**: Restaurant entity and related types
- **Product**: Product entity and related types
- **Client**: Client (user) entity and related types
- **AuthTokens**: Authentication tokens and related types
- **Order**: Order entity and related types

### Environment Schema Validation

The package also includes Zod schemas for validating environment variables:

```typescript
import { backendEnvSchema } from '@eatontime/contracts';

// Validate process.env against the schema
const validatedEnv = backendEnvSchema.parse(process.env);
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

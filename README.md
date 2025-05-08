# Harry's Firebolt

A prompt validation and enhancement middleware for AI code generators.

## Overview

Harry's Firebolt is a TypeScript-based middleware that validates and enhances prompts for AI code generation. It provides both REST API and WebSocket interfaces for real-time prompt validation and enhancement.

## Features

- **Prompt Validation**
  - Length validation
  - Clarity scoring
  - Technical term detection
  - Code block validation
  - Example presence checking

- **Real-time Processing**
  - WebSocket interface for live validation
  - REST API endpoint for synchronous validation

- **Enhancement Capabilities**
  - Auto-formatting
  - Clarity enhancement
  - Structure enhancement

## Project Structure

```
src/
├── config/         # Configuration files
├── core/          # Core business logic
├── middleware/    # Express middleware
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

For development:
```bash
npm run dev
```

## API Documentation

### REST API

#### POST /validate
Validates and enhances a prompt.

Request:
```json
{
  "prompt": "string"
}
```

Response:
```json
{
  "original": "string",
  "enhanced": "string",
  "metadata": {
    "id": "string",
    "timestamp": "number",
    "version": "string",
    "source": "string"
  },
  "validation": {
    "isValid": "boolean",
    "errors": "string[]",
    "warnings": "string[]",
    "suggestions": "string[]"
  }
}
```

### WebSocket API

Connect to `ws://localhost:3001` and send messages in the format:
```json
{
  "prompt": "string"
}
```

Responses follow the same format as the REST API.

## Configuration

The system can be configured through `src/config/default.ts`. Key settings include:

- Validation thresholds
- Enhancement rules
- Logging preferences

## Development

- `npm run build` - Build the project
- `npm run dev` - Run in development mode
- `npm test` - Run tests
- `npm run lint` - Run linter

## License

ISC

# Harry's Firebolt Frontend

A modern React application for Harry's Firebolt, an AI-powered prompt enhancement system.

## Features

- Real-time WebSocket communication with the backend
- Material-UI based modern interface
- Prompt input and enhancement display
- Validation results visualization
- Metadata display with clarity scores and statistics

## Prerequisites

- Node.js 14.0.0 or later
- npm 6.0.0 or later

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000.

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Development

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── PromptPanel.tsx
│   │   └── ResultPanel.tsx
│   ├── store/
│   │   └── promptStore.ts
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
import express, { Request, Response, RequestHandler } from 'express';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { defaultConfig } from './config/default';
import { PromptValidator } from './utils/validator';
import { PromptEnhancer } from './utils/enhancer';
import { EnhancedPrompt, ValidationResult } from './types';

interface ValidateRequest {
  prompt: string;
}

const app = express();
const port = process.env.PORT || 3000;

// Initialize validator and enhancer with default config
const validator = new PromptValidator(defaultConfig);
const enhancer = new PromptEnhancer(defaultConfig);

// Middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Harry\'s Firebolt',
    version: defaultConfig.version,
    description: 'Prompt validation and enhancement middleware for AI code generators',
    endpoints: {
      validate: {
        method: 'POST',
        path: '/validate',
        description: 'Validates and enhances a prompt'
      },
      websocket: {
        path: 'ws://localhost:3001',
        description: 'Real-time prompt validation and enhancement'
      }
    }
  });
});

// Routes
const validateHandler: RequestHandler = (req, res) => {
  const { prompt } = req.body as ValidateRequest;
  
  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const validation = validator.validate(prompt);
  const enhancedPrompt: EnhancedPrompt = {
    original: prompt,
    enhanced: enhancer.enhance(prompt),
    metadata: {
      id: uuidv4(),
      timestamp: Date.now(),
      version: defaultConfig.version,
      source: 'api'
    },
    validation
  };

  res.json(enhancedPrompt);
};

app.post('/validate', validateHandler);

// WebSocket server for real-time validation
const wss = new WebSocketServer({ port: 3007 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const { prompt } = JSON.parse(message.toString());
      const validation = validator.validate(prompt);
      
      const enhancedPrompt: EnhancedPrompt = {
        original: prompt,
        enhanced: enhancer.enhance(prompt),
        metadata: {
          id: uuidv4(),
          timestamp: Date.now(),
          version: defaultConfig.version,
          source: 'websocket'
        },
        validation
      };

      ws.send(JSON.stringify(enhancedPrompt));
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`WebSocket server running on port 3007`);
}); 
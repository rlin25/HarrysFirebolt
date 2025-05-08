import React, { useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { usePromptStore } from '../store/promptStore';

interface Message {
  type: 'sent' | 'received' | 'error';
  content: string;
  timestamp: number;
}

const PromptPanel: React.FC = () => {
  const {
    prompt,
    messages,
    connected,
    setPrompt,
    addMessage,
    setConnected,
    setEnhancedPrompt,
    setValidationResult,
  } = usePromptStore();

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      ws.current = new WebSocket('ws://localhost:3007');

      ws.current.onopen = () => {
        setConnected(true);
        addMessage('received', 'Connected to WebSocket server');
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
      };

      ws.current.onclose = () => {
        setConnected(false);
        addMessage('error', 'Disconnected from WebSocket server');
        // Attempt to reconnect after 5 seconds
        reconnectTimeout.current = setTimeout(connectWebSocket, 5000);
      };

      ws.current.onerror = (error: Event) => {
        addMessage('error', 'WebSocket error occurred');
        console.error('WebSocket error:', error);
      };

      ws.current.onmessage = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          addMessage('received', 'Received enhanced prompt');
          
          if (response.enhanced) {
            setEnhancedPrompt(response.enhanced);
          }
          
          if (response.validation) {
            setValidationResult(response.validation);
          }
        } catch (error) {
          addMessage('error', 'Failed to parse server response');
          console.error('Parse error:', error);
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      addMessage('error', 'Failed to connect to WebSocket server');
      // Attempt to reconnect after 5 seconds
      reconnectTimeout.current = setTimeout(connectWebSocket, 5000);
    }
  }, [addMessage, setConnected, setEnhancedPrompt, setValidationResult]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectWebSocket, addMessage, setConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!prompt.trim()) {
      addMessage('error', 'Please enter a prompt');
      return;
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ prompt }));
      addMessage('sent', 'Sent prompt for enhancement');
    } else {
      addMessage('error', 'WebSocket is not connected');
      connectWebSocket(); // Attempt to reconnect
    }
  };

  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" gutterBottom>
        Input Prompt
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={!connected}
        fullWidth
      >
        Send Prompt
      </Button>
      <Box sx={{ mt: 2, height: 300, overflow: 'auto' }}>
        <List>
          {messages.map((message: Message, index: number) => (
            <ListItem
              key={index}
              sx={{
                bgcolor:
                  message.type === 'sent'
                    ? 'primary.light'
                    : message.type === 'received'
                    ? 'success.light'
                    : 'error.light',
                mb: 1,
                borderRadius: 1,
              }}
            >
              <ListItemText
                primary={message.content}
                secondary={new Date(message.timestamp).toLocaleTimeString()}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>
    </Paper>
  );
};

export default PromptPanel; 
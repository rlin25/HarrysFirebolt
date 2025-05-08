import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { usePromptStore } from '../store/promptStore';

const ResultPanel: React.FC = () => {
  const { enhancedPrompt, validationResult } = usePromptStore();

  const renderValidationResults = () => {
    if (!validationResult) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Validation Results
        </Typography>
        <List>
          {validationResult.errors.map((error, index) => (
            <ListItem key={`error-${index}`} sx={{ color: 'error.main' }}>
              <ListItemText primary={error} />
            </ListItem>
          ))}
          {validationResult.warnings.map((warning, index) => (
            <ListItem key={`warning-${index}`} sx={{ color: 'warning.main' }}>
              <ListItemText primary={warning} />
            </ListItem>
          ))}
          {validationResult.suggestions.map((suggestion, index) => (
            <ListItem key={`suggestion-${index}`} sx={{ color: 'success.main' }}>
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const renderMetadata = () => {
    if (!validationResult?.metadata) return null;

    const { clarityScore, technicalTermCount, codeBlockCount, exampleCount } =
      validationResult.metadata;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Metadata
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Clarity: ${(clarityScore * 100).toFixed(1)}%`}
            color={clarityScore >= 0.7 ? 'success' : 'warning'}
          />
          <Chip
            label={`Technical Terms: ${technicalTermCount}`}
            color="primary"
          />
          <Chip
            label={`Code Blocks: ${codeBlockCount}`}
            color="secondary"
          />
          <Chip
            label={`Examples: ${exampleCount}`}
            color="info"
          />
        </Box>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" gutterBottom>
        Enhanced Prompt
      </Typography>
      <Box
        component="pre"
        sx={{
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 1,
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
        }}
      >
        {enhancedPrompt || 'No enhanced prompt yet'}
      </Box>
      {renderMetadata()}
      {renderValidationResults()}
    </Paper>
  );
};

export default ResultPanel; 
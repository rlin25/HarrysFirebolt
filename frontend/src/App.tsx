import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography } from '@mui/material';
import PromptPanel from './components/PromptPanel';
import ResultPanel from './components/ResultPanel';
import { usePromptStore } from './store/promptStore';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

function App() {
  const { connected } = usePromptStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Harry's Firebolt
          </Typography>
          <Typography variant="subtitle1" align="center" color={connected ? 'success.main' : 'error.main'}>
            {connected ? 'Connected' : 'Disconnected'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <PromptPanel />
            <ResultPanel />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 
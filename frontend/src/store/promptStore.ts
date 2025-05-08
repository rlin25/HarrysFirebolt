import { create } from 'zustand';
import { ValidationResult } from '../types';

interface PromptState {
  connected: boolean;
  prompt: string;
  enhancedPrompt: string;
  validationResult: ValidationResult | null;
  messages: Array<{
    type: 'sent' | 'received' | 'error';
    content: string;
    timestamp: number;
  }>;
  setConnected: (connected: boolean) => void;
  setPrompt: (prompt: string) => void;
  setEnhancedPrompt: (prompt: string) => void;
  setValidationResult: (result: ValidationResult) => void;
  addMessage: (type: 'sent' | 'received' | 'error', content: string) => void;
  clearMessages: () => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  connected: false,
  prompt: '',
  enhancedPrompt: '',
  validationResult: null,
  messages: [],
  setConnected: (connected: boolean) => set({ connected }),
  setPrompt: (prompt: string) => set({ prompt }),
  setEnhancedPrompt: (enhancedPrompt: string) => set({ enhancedPrompt }),
  setValidationResult: (validationResult: ValidationResult) => set({ validationResult }),
  addMessage: (type: 'sent' | 'received' | 'error', content: string) =>
    set((state: PromptState) => ({
      messages: [
        ...state.messages,
        { type, content, timestamp: Date.now() },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
})); 
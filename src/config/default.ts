import { SystemConfig } from '../types';

export const defaultConfig: SystemConfig = {
  version: '1.0.0',
  validationThresholds: {
    minLength: 10,
    maxLength: 5000,
    minClarity: 0.7
  },
  enhancementRules: {
    enableAutoFormatting: true,
    enableClarityEnhancement: true,
    enableStructureEnhancement: true
  },
  logging: {
    level: 'info',
    enableConsole: true,
    enableFile: true
  }
}; 
import { SystemConfig } from '../types';

export const defaultConfig: SystemConfig = {
  version: '1.0.0',
  validationThresholds: {
    minLength: 20,
    maxLength: 2000,
    minClarity: 0.5
  },
  enhancementRules: {
    enableAutoFormatting: true,
    enableClarityEnhancement: true,
    enableStructureEnhancement: true
  },
  logging: {
    level: 'info',
    enableConsole: true,
    enableFile: false
  }
}; 
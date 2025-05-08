import { AIEngine } from './core/AIEngine';
import { SystemConfig } from './types';

async function runTests() {
  // Initialize AI Engine with test configuration
  const config: SystemConfig = {
    version: '1.0.0',
    validationThresholds: {
      minLength: 10,
      maxLength: 1000,
      minClarity: 0.7
    },
    enhancementRules: {
      enableAutoFormatting: true,
      enableClarityEnhancement: true,
      enableStructureEnhancement: true
    },
    logging: {
      level: 'debug',
      enableConsole: true,
      enableFile: false
    },
    performance: {
      promptAnalysisTimeout: 5000,
      documentationTimeout: 5000,
      interactionTimeout: 5000
    },
    feedback: {
      enableLearning: true,
      minFeedbackThreshold: 0.7,
      adaptationRate: 0.1
    }
  };

  const engine = new AIEngine(config);

  try {
    // Test prompt processing
    console.log('Testing prompt processing...');
    const testPrompt = 'Create a function that calculates the Fibonacci sequence up to n terms';
    const result = await engine.processPrompt(testPrompt);
    console.log('Prompt processing result:', JSON.stringify(result, null, 2));

    // Test prompt enhancement
    console.log('\nTesting prompt enhancement...');
    const enhancedPrompt = await engine.enhancePrompt(testPrompt);
    console.log('Enhanced prompt:', enhancedPrompt);

    // Test feedback processing
    console.log('\nTesting feedback processing...');
    await engine.processFeedback({
      id: 'test-1',
      promptId: 'test-1',
      rating: 0.8,
      comments: 'Good enhancement, but could be more detailed',
      timestamp: new Date().toISOString(),
      metadata: {
        clarity: 0.8,
        validation: 0.7,
        enhancement: 0.75,
        userSatisfaction: 0.8
      }
    });

    // Get system metrics
    console.log('\nGetting system metrics...');
    const metrics = await engine.getSystemMetrics();
    console.log('System metrics:', JSON.stringify(metrics, null, 2));

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests().catch(console.error); 
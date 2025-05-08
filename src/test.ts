console.log('Starting test suite...');

// Test 1: UUID
import { v4 as uuidv4 } from 'uuid';
try {
  console.log('Running UUID test...');
  const uuid = uuidv4();
  console.log('Test 1 - UUID:', uuid);
} catch (error) {
  console.error('UUID test failed:', error);
  process.exit(1);
}

// Test 2: Natural
import natural from 'natural';
try {
  console.log('Running Natural test...');
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize('test');
  console.log('Test 2 - Natural:', tokens);
} catch (error) {
  console.error('Natural test failed:', error);
  process.exit(1);
}

// Test 3: Ajv
import Ajv from 'ajv';
try {
  console.log('Running Ajv test...');
  const ajv = new Ajv();
  const validate = ajv.compile({ type: 'string' });
  console.log('Test 3 - Ajv:', validate);
} catch (error) {
  console.error('Ajv test failed:', error);
  process.exit(1);
}

console.log('All basic tests completed successfully');
process.exit(0); 
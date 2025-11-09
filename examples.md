# Miniparse Usage Examples

## Basic Usage

### Simple Text Processing
```typescript
import { Pipeline } from 'miniparse';

async function basicExample() {
  const pipeline = new Pipeline();
  const result = await pipeline.process('Hello world! This is a test.');
  
  console.log(result);
  // Output will contain tokens and extracted entities
}
```

### Using Custom Configuration
```typescript
import { Pipeline } from 'miniparse';

// Use a custom config file
const pipeline = new Pipeline('./my-config.yaml');
const result = await pipeline.process('Sample text...');
```

## Speech Analysis Examples

### Analyzing Speech Patterns
```typescript
import { analyzeSpeechPatterns } from 'miniparse';

const speechText = "Um, well, I think that, uh, like, you know, the project is good.";

const analysis = analyzeSpeechPatterns(speechText);

console.log('Filler words found:', analysis.fillerWords);
// Output: ['Um,', 'well,', 'uh,', 'like,', 'you', 'know,']

console.log('Repetitions found:', analysis.repetitions);
// Output: [] (no repetitions in this example)

console.log('Stutters found:', analysis.stutters);
// Output: [] (no stutters in this example)
```

### Preprocessing Speech
```typescript
import { preprocessSpeechInput } from 'miniparse';

const speechText = "Um, well, I think that, uh, like, you know, the project is good.";

// Remove filler words only
const cleanText1 = preprocessSpeechInput(speechText, {
  removeFillerWords: true,
  detectRepetitions: false,
  findStutters: false
});
console.log(cleanText1);
// Output: "I think that, the project is good."

// Remove filler words and detect repetitions
const cleanText2 = preprocessSpeechInput(speechText, {
  removeFillerWords: true,
  detectRepetitions: true,
  findStutters: false
});
console.log(cleanText2);
```

## Advanced Processing Examples

### Custom Processor
```typescript
import { Pipeline, type PipelineComponent, IntentResult } from 'miniparse';

// Create a custom processor to find hashtags
const hashtagProcessor: PipelineComponent = (input: IntentResult) => {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  let match;
  
  // Note: In real implementation, you'd avoid regex and use string parsing
  const text = input.text;
  let searchIndex = 0;
  
  while (searchIndex < text.length) {
    const hashtagStart = text.indexOf('#', searchIndex);
    if (hashtagStart === -1) break;
    
    let hashtagEnd = hashtagStart + 1;
    while (hashtagEnd < text.length && 
           /[a-zA-Z0-9_]/.test(text[hashtagEnd])) {
      hashtagEnd++;
    }
    
    if (hashtagEnd > hashtagStart + 1) { // Valid hashtag found
      input.entities.push({
        type: 'hashtag',
        value: text.substring(hashtagStart, hashtagEnd),
        start: hashtagStart,
        end: hashtagEnd
      });
    }
    
    searchIndex = hashtagEnd;
  }
  
  return input;
};

const pipeline = new Pipeline();
pipeline.addCustomProcessor(hashtagProcessor);

const result = await pipeline.process('Check out #typescript and #miniparse!');
console.log(result.entities);
// Output: entities array including hashtags
```

### Processing Text with Different Configurations
```typescript
import { Pipeline } from 'miniparse';

// Create a pipeline that only does tokenization and normalization
const minimalPipeline = new Pipeline();
// Disable all processors except normalization
minimalPipeline.use((input) => input); // This is a no-op, just to demonstrate

// Process with full pipeline
const fullPipeline = new Pipeline();

const text = 'Contact us at support@example.com or call (555) 123-4567';

const minimalResult = await minimalPipeline.process(text);
const fullResult = await fullPipeline.process(text);

console.log('Minimal processing result:', minimalResult);
console.log('Full processing result:', fullResult);
```

### Extracting Specific Information
```typescript
import { Pipeline } from 'miniparse';

async function extractSpecificInfo() {
  const pipeline = new Pipeline();
  const text = `
    Hello! My name is John Doe. You can reach me at john.doe@example.com 
    or call me at 555-123-4567. I work at Tech Corp and my website is 
    https://www.techcorp.com. I was born in 1990.
  `;
  
  const result = await pipeline.process(text);
  
  // Filter for specific entity types
  const emails = result.entities.filter(e => e.type === 'email');
  const phones = result.entities.filter(e => e.type === 'phone');
  const urls = result.entities.filter(e => e.type === 'url');
  const numbers = result.entities.filter(e => e.type === 'number');
  
  console.log('Emails found:', emails);
  console.log('Phones found:', phones);
  console.log('URLs found:', urls);
  console.log('Numbers found:', numbers);
}
```

## Configuration Examples

### Default Configuration File
Create a `miniparse.config.yaml` in your project:

```yaml
pipeline:
  enableNormalization: true
  enableCleaning: true
  enableExtraction: true
  enableSegmentation: true

tokenizer:
  lowercase: true
  mergeSymbols: false

speech:
  removeFillerWords: true
  detectRepetitions: false
  findStutters: false

extraction:
  extractEmails: true
  extractPhones: true
  extractUrls: true
  extractNumbers: true
```

### Using Different Configurations
```typescript
import { ConfigLoader } from 'miniparse';

// Load configuration programmatically
const config = ConfigLoader.loadConfig('./path/to/config.yaml');

// Create pipeline with specific config
const pipeline = new Pipeline('./path/to/config.yaml');
```

## Performance Considerations

### Processing Large Texts
```typescript
import { Pipeline } from 'miniparse';

async function processLargeText() {
  const pipeline = new Pipeline();
  
  // For very large texts, consider breaking them into smaller chunks
  const largeText = '...'; // Very large string
  
  // Split into sentences or paragraphs for processing
  const chunks = largeText.split(/[\r\n]+/).filter(chunk => chunk.trim().length > 0);
  
  const results = [];
  for (const chunk of chunks) {
    const result = await pipeline.process(chunk);
    results.push(result);
  }
  
  return results;
}
```

## Advanced Configuration and Custom Extraction

### Using Individual Extraction Functions
You can also use individual extraction functions when you need fine-grained control over which entities are extracted. The library exports separate functions that can be added to the pipeline as needed:

```typescript
import { Pipeline, extractEmailsOnly, extractPhonesOnly, extractUrlsOnly, extractNumbersOnly } from 'miniparse';

async function customExtraction() {
  const pipeline = new Pipeline();
  
  // Add only specific extraction processors to the pipeline
  pipeline.addCustomProcessor(extractEmailsOnly);  // Only email extraction
  // pipeline.addCustomProcessor(extractPhonesOnly);  // Uncomment to add phone extraction too
  
  const result = await pipeline.process('Email: test@example.com and Phone: (555) 123-4567');
  // Only emails will be extracted based on the processors added
  console.log('Result entities:', result.entities.filter(e => e.type === 'email'));
}
```
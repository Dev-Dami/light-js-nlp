# Miniparse

A fast, lightweight, and configurable NLP library for text processing, tokenization, and analysis.

## Features

- **Fast & Lightweight**: Minimal dependencies, optimized performance
- **Configurable**: YAML-based configuration system
- **Regex-Free**: Fast string-based parsing without heavy regex operations
- **Speech Analysis**: Identify and process speech patterns like filler words and repetitions
- **Pipeline Architecture**: Flexible processing pipeline with multiple stages
- **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install miniparse
```

## Quick Start

```typescript
import { Pipeline } from 'miniparse';

const pipeline = new Pipeline();
const result = await pipeline.process('Hello world! This is a test.');

console.log(result);
```

## Configuration

Miniparse is highly configurable. Create a `miniparse.config.yaml` file in your project root:

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

## API Documentation

### Pipeline

The main processing class that orchestrates text analysis:

```typescript
const pipeline = new Pipeline(configPath?);
const result = await pipeline.process(text);
```

### Speech Analysis

Functions for analyzing speech patterns:

```typescript
import { preprocessSpeechInput, analyzeSpeechPatterns } from 'miniparse';

// Preprocess speech text
const cleanText = preprocessSpeechInput(speechText, {
  removeFillerWords: true,
  detectRepetitions: true,
  findStutters: false
});

// Analyze speech patterns
const analysis = analyzeSpeechPatterns(speechText);
```

### Configuration Loading

Load configurations from custom paths:

```typescript
import { ConfigLoader } from 'miniparse';

const config = ConfigLoader.loadConfig('./custom-config.yaml');
```

## Advanced Usage

### Custom Configuration

```typescript
import { Pipeline } from 'miniparse';

// Use a custom config file
const pipeline = new Pipeline('./path/to/config.yaml');
```

### Adding Custom Processors

```typescript
import { Pipeline, type PipelineComponent, IntentResult } from 'miniparse';

const customProcessor: PipelineComponent = (input: IntentResult) => {
  // Add custom processing logic
  input.entities.push({
    type: 'custom',
    value: 'custom entity',
    start: 0,
    end: 13
  });
  return input;
};

const pipeline = new Pipeline();
pipeline.addCustomProcessor(customProcessor);
```

### Speech Pattern Analysis

```typescript
import { preprocessSpeechInput, analyzeSpeechPatterns } from 'miniparse';

const speechText = "Um, well, I think that, uh, like, you know, the project is good";

// Analyze speech patterns
const analysis = analyzeSpeechPatterns(speechText);
console.log('Filler words:', analysis.fillerWords);
console.log('Repetitions:', analysis.repetitions);
console.log('Stutters:', analysis.stutters);

// Clean speech text
const cleanText = preprocessSpeechInput(speechText, {
  removeFillerWords: true,
  detectRepetitions: true
});
```

## Processors

Miniparse includes several built-in processors that can be individually enabled/disabled via configuration:

- **Normalization**: Converts text to lowercase, normalizes numbers
- **Cleaning**: Removes punctuation and whitespace tokens  
- **Extraction**: Extracts emails, phones, URLs, and numbers (configurable via `extraction.extractEmails`, `extraction.extractPhones`, `extraction.extractUrls`, `extraction.extractNumbers`)
- **Segmentation**: Segments text into sentences

## Configuration

Extraction processors are individually configurable through the configuration file, allowing fine-grained control over which types of entities are extracted. This makes the library more efficient when only specific entity types are needed:

```yaml
extraction:
  extractEmails: true     # Enable email extraction
  extractPhones: false    # Disable phone number extraction
  extractUrls: true       # Enable URL extraction  
  extractNumbers: false   # Disable number extraction
```

## Contributing

Contributions are welcome! Please see our [contributing guide](CONTRIBUTING.md) for more details.

## License

MIT © 2025
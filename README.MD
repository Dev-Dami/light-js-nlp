# Miniparse

<div align="center">

[![CI](https://github.com/dev-dami/miniparse/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dev-dami/miniparse/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/devdami-miniparse.svg?style=flat)](https://www.npmjs.com/package/devdami-miniparse)
[![NPM downloads](https://img.shields.io/npm/dm/devdami-miniparse.svg?style=flat)](https://www.npmjs.com/package/devdami-miniparse)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Code style: neostandard](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)
[![Contribute with Gitpod](https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod\&color=blue)](https://gitpod.io/#https://github.com/dev-dami/miniparse)

</div>

Miniparse is a fast, lightweight, and configurable NLP library for text processing, tokenization, and analysis. Designed for speed and simplicity, it offers a modular pipeline, YAML configuration, and advanced LLM integration with Google Gemini.

---

### Table of Contents

* [Quick start](#quick-start)
* [Install](#install)
* [Example](#example)
* [Core features](#core-features)
* [LLM Integration](#llm-integration)
* [Configuration](#configuration)
* [API](#api)
* [Advanced usage](#advanced-usage)
* [Contributing](#contributing)
* [License](#license)
* [Future plans](#future-plans)

---

## Quick Start

Create a folder and initialize a project:

```bash
mkdir my-miniparse-app
cd my-miniparse-app
npm init -y
```

Install Miniparse:

```bash
npm install devdami-miniparse @google/generative-ai
```

Create a `main.ts` file:

```typescript
import { Pipeline, GeminiLLMAdapter, createLLMSentimentAnalyzer } from 'miniparse';

// Create a pipeline
const pipeline = new Pipeline();

// Create a Gemini LLM adapter (requires API key)
const geminiAdapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash',
});

// Add an LLM sentiment analyzer
pipeline.addLLMProcessor(createLLMSentimentAnalyzer(geminiAdapter));

const result = await pipeline.process('I love this product! It works perfectly.');
console.log(result);
```

Run it:

```bash
npm start
```

---

## Install

To install Miniparse in an existing project:

```bash
npm i devdami-miniparse @google/generative-ai
```

---

## Example

### Basic usage

```typescript
import { Pipeline } from 'miniparse';

const pipeline = new Pipeline();
const result = await pipeline.process('Miniparse makes text analysis easy!');

console.log(result);
```

### With LLM integration

```typescript
import { Pipeline, GeminiLLMAdapter, createLLMSummarizer } from 'miniparse';

const geminiAdapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash', // Free, fast model
});

const pipeline = new Pipeline();
pipeline.addLLMProcessor(createLLMSummarizer(geminiAdapter, undefined, 50));

const result = await pipeline.process('Your long text here...');
console.log(result.entities); // Contains summary entity
```

### With configuration

```typescript
import { Pipeline } from 'miniparse';

const pipeline = new Pipeline('./miniparse.config.yaml');
const result = await pipeline.process('Testing custom configuration.');

console.log(result);
```

## Use Cases

Miniparse is designed for a variety of text processing and analysis scenarios:

### Content Moderation
Automatically analyze user-generated content to detect inappropriate language, sentiment, or topics:

```typescript
import { Pipeline, GeminiLLMAdapter, createLLMSentimentAnalyzer } from 'miniparse';

const pipeline = new Pipeline();
const adapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash'
});

pipeline.addLLMProcessor(createLLMSentimentAnalyzer(adapter));
const result = await pipeline.process('User comment here...');
// Check result.entities for sentiment classification
```

### Customer Support Automation
Process and classify customer queries to route them to appropriate support teams:

```typescript
const pipeline = new Pipeline();
const adapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash'
});

pipeline.addLLMProcessor(createLLMIntentClassifier(adapter, [
  'billing', 'technical', 'account', 'feedback'
]));
const result = await pipeline.process('Customer query...');
```

### Document Analysis
Extract key information from documents and summarize content:

```typescript
const pipeline = new Pipeline();
const adapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash'
});

pipeline.addLLMProcessor(createLLMSummarizer(adapter, undefined, 100));
pipeline.addLLMProcessor(createLLMEntityExtractor(
  'Extract important entities like dates, names, and amounts:',
  adapter
));
const result = await pipeline.process('Long document...');
```

### Social Media Monitoring
Analyze social media posts for brand mentions, sentiment, and trending topics:

```typescript
const pipeline = new Pipeline();
const adapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash'
});

pipeline.addLLMProcessor(createLLMTopicClassifier(adapter));
pipeline.addLLMProcessor(createLLMSentimentAnalyzer(adapter));
const result = await pipeline.process('Social media post...');
```

### Data Extraction from Unstructured Text
Extract structured information from unstructured text sources:

```typescript
const pipeline = new Pipeline();
// Use built-in extractors for common entities
const result = await pipeline.process('Contact: john@example.com, Phone: 555-1234');
// result.entities will contain extracted emails and phones
```

### Speech-to-Text Post-Processing
Clean and analyze transcribed speech for applications like meeting notes or interviews:

```typescript
const pipeline = new Pipeline();
// Clean up speech artifacts like filler words
const result = await pipeline.process('Um, so, like, we should consider, uh, the options...');
// Clean text without filler words and improved structure
```

---

## Core Features

* Fast and lightweight: minimal dependencies and optimized performance.
* Configurable: YAML-based configuration system.
* Regex-free: efficient string parsing without heavy regular expressions.
* Speech analysis: identify filler words, repetitions, and stutters.
* Pipeline architecture: modular, extendable processing pipeline.
* TypeScript support: full type definitions.
* LLM Integration: Built-in support for Google Gemini API with caching and fallbacks.

---

## LLM Integration

Miniparse now includes powerful integration with Google's Gemini API, featuring the free and fast Gemini 2.5 Flash model.

### Available LLM Components

* `createLLMSentimentAnalyzer`: Analyze text sentiment using AI
* `createLLMEntityExtractor`: Extract named entities using AI
* `createLLMSummarizer`: Summarize text using AI
* `createLLMTopicClassifier`: Classify topics in text using AI
* `createLLMIntentClassifier`: Identify user intent using AI
* `createLLMTextEnhancer`: Enhance text quality using AI

### Setup

First, install the Google Generative AI package:

```bash
npm install @google/generative-ai
```

Get your API key from [Google AI Studio](https://aistudio.google.com/), then use in your code:

```typescript
import { GeminiLLMAdapter, createLLMSentimentAnalyzer } from 'miniparse';

const adapter = new GeminiLLMAdapter({
  apiKey: 'your-api-key',
  model: 'gemini-2.5-flash',  // Free, fast model
});
```

### LLM Configuration

You can also configure LLM functionality through YAML:

```yaml
llm:
  enabled: true
  provider: gemini
  apiKey: ${GEMINI_API_KEY}  # Environment variable
  model: gemini-2.5-flash
  temperature: 0.7
  maxTokens: 1024
```

---

## Configuration

Miniparse supports YAML-based configuration. Create a `miniparse.config.yaml` file:

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

llm:
  enabled: false
  provider: gemini
  model: gemini-2.5-flash
  temperature: 0.7
  maxTokens: 1024
```

You can load this automatically or specify a custom path when creating a `Pipeline`.

---

## API

### Pipeline

The main processing class that orchestrates text analysis:

```typescript
const pipeline = new Pipeline(configPath?);
const result = await pipeline.process(text);
```

### LLM Integration Methods

```typescript
// Get the configured LLM adapter
const adapter = pipeline.getLLMAdapter();

// Add an LLM processor
pipeline.addLLMProcessor(llmProcessor);
```

### Speech Analysis

Functions for analyzing and cleaning speech patterns:

```typescript
import { preprocessSpeechInput, analyzeSpeechPatterns } from 'miniparse';

const cleanText = preprocessSpeechInput('Um, like, you know...', {
  removeFillerWords: true,
  detectRepetitions: true,
  findStutters: false
});

const analysis = analyzeSpeechPatterns('Uh, I think, uh, it’s okay');
console.log(analysis);
```

### Configuration Loader

Load configuration manually:

```typescript
import { ConfigLoader } from 'miniparse';

const config = ConfigLoader.loadConfig('./custom-config.yaml');
```

---

## Advanced Usage

### Custom LLM Processors

Add your own LLM processing components:

```typescript
import { 
  Pipeline, 
  GeminiLLMAdapter, 
  createLLMProcessor 
} from 'miniparse';

const geminiAdapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash',
});

// Create a custom LLM processor
const customLLMProcessor = createLLMProcessor({
  promptTemplate: "Classify this text as positive, negative, or neutral: {text}",
  adapter: geminiAdapter
});

const pipeline = new Pipeline();
pipeline.addLLMProcessor(customLLMProcessor);
```

### Multiple LLM Processors

Chain multiple AI-powered processors:

```typescript
import { 
  Pipeline, 
  GeminiLLMAdapter,
  createLLMSentimentAnalyzer,
  createLLMTopicClassifier,
  createLLMSummarizer
} from 'miniparse';

const geminiAdapter = new GeminiLLMAdapter({
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash',
});

const pipeline = new Pipeline();

// Add multiple LLM processors
pipeline.addLLMProcessor(createLLMSentimentAnalyzer(geminiAdapter));
pipeline.addLLMProcessor(createLLMTopicClassifier(geminiAdapter));
pipeline.addLLMProcessor(createLLMSummarizer(geminiAdapter, undefined, 50));

const result = await pipeline.process('Your text here...');
console.log(result.entities); // Contains sentiment, topic, and summary entities
```

### Custom Processors

Add your own processing components:

```typescript
import { Pipeline, type PipelineComponent, IntentResult } from 'miniparse';

const customProcessor: PipelineComponent = (input: IntentResult) => {
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

const speech = 'Um, well, I think that, uh, like, you know, the project is good';

const analysis = analyzeSpeechPatterns(speech);
console.log('Filler words:', analysis.fillerWords);
console.log('Repetitions:', analysis.repetitions);
console.log('Stutters:', analysis.stutters);

const cleanText = preprocessSpeechInput(speech, {
  removeFillerWords: true,
  detectRepetitions: true
});
```

---

## Processors

Built-in processors can be individually enabled or disabled through configuration:

* Normalization: converts text to lowercase and normalizes numbers.
* Cleaning: removes punctuation and whitespace tokens.
* Extraction: extracts entities like emails, phones, URLs, and numbers.
* Segmentation: splits text into sentences.
* LLM Processors: AI-powered text analysis and processing components.

Example configuration:

```yaml
extraction:
  extractEmails: true
  extractPhones: false
  extractUrls: true
  extractNumbers: false

llm:
  enabled: true
  provider: gemini
  model: gemini-2.5-flash
```

---

## Contributing

Contributions are welcome. Please see the [Contributing Guide](./CONTRIBUTING.md) for more details.


---

## Future Plans

### Version 0.2.0: Enhanced Text Processing and LLM Integration

Planned features include:

* Corrective text input: advanced cleaning and normalization.
* Enhanced LLM integration: support for more models and providers.
* API endpoints: RESTful API for external services.
* Expanded documentation: comprehensive guides and API references.

---

## License

Licensed under the [MIT License](./LICENSE) © 2025.

# Miniparse

<div align="center">

[![CI](https://github.com/miniparse/miniparse/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/miniparse/miniparse/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/miniparse.svg?style=flat)](https://www.npmjs.com/package/miniparse)
[![NPM downloads](https://img.shields.io/npm/dm/miniparse.svg?style=flat)](https://www.npmjs.com/package/miniparse)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Code style: neostandard](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)
[![Discord](https://img.shields.io/discord/123456789012345678)](https://discord.gg/miniparse)
[![Contribute with Gitpod](https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod\&color=blue)](https://gitpod.io/#https://github.com/miniparse/miniparse)

</div>

Miniparse is a fast, lightweight, and configurable NLP library for text processing, tokenization, and analysis. Designed for speed and simplicity, it offers a modular pipeline, YAML configuration, and speech analysis tools.

---

### Table of Contents

* [Quick start](#quick-start)
* [Install](#install)
* [Example](#example)
* [Core features](#core-features)
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
npm install devdami-miniparse
```

Create a `main.ts` file:

```typescript
import { Pipeline } from 'miniparse';

const pipeline = new Pipeline();
const result = await pipeline.process('Hello world! This is a test.');

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
npm i devdami-miniparse
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

### With configuration

```typescript
import { Pipeline } from 'miniparse';

const pipeline = new Pipeline('./miniparse.config.yaml');
const result = await pipeline.process('Testing custom configuration.');

console.log(result);
```

---

## Core Features

* Fast and lightweight: minimal dependencies and optimized performance.
* Configurable: YAML-based configuration system.
* Regex-free: efficient string parsing without heavy regular expressions.
* Speech analysis: identify filler words, repetitions, and stutters.
* Pipeline architecture: modular, extendable processing pipeline.
* TypeScript support: full type definitions.

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

Example configuration:

```yaml
extraction:
  extractEmails: true
  extractPhones: false
  extractUrls: true
  extractNumbers: false
```

---

## Contributing

Contributions are welcome. Please see the [Contributing Guide](./CONTRIBUTING.md) for more details.

Join the community on [Discord](https://discord.gg/miniparse).

---

## Future Plans

### Version 0.2.0: Enhanced Text Processing and LLM Integration

Planned features include:

* Corrective text input: advanced cleaning and normalization.
* LLM connector: direct integration with language model APIs.
* API endpoints: RESTful API for external services.
* Expanded documentation: comprehensive guides and API references.

---

## License

Licensed under the [MIT License](./LICENSE) © 2025.

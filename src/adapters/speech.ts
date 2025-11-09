export interface SpeechPatternOptions {
  removeFillerWords?: boolean;
  detectRepetitions?: boolean;
  findStutters?: boolean;
}

export function preprocessSpeechInput(
  text: string,
  options?: SpeechPatternOptions
): string {
  const opts = {
    removeFillerWords: options?.removeFillerWords ?? true,
    detectRepetitions: options?.detectRepetitions ?? false,
    findStutters: options?.findStutters ?? false,
  };

  let result = text;

  if (opts.removeFillerWords) {
    result = removeFillerWords(result);
  }

  if (opts.detectRepetitions) {
    result = removeRepetitions(result);
  }

  if (opts.findStutters) {
    result = removeStutters(result);
  }

  return result.trim();
}

function removeFillerWords(text: string): string {
  const words = text.split(/\s+/);
  const fillerWords = new Set(['um', 'umm', 'uh', 'uhh', 'like', 'you know', 'so', 'well', 'actually', 'basically', 'literally']);
  const result: string[] = [];

  for (const word of words) {
    // Check for basic filler words
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    if (!fillerWords.has(cleanWord)) {
      result.push(word);
    }
  }

  return result.join(' ');
}

function removeRepetitions(text: string): string {
  const words = text.split(/\s+/);
  const result: string[] = [];

  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    if (i < words.length - 1 && words[i] && words[i + 1] &&
        words[i]!.toLowerCase() === words[i + 1]!.toLowerCase()) {
      continue;
    }
    result.push(words[i]!);
  }

  return result.join(' ');
}

function removeStutters(text: string): string {
  const words = text.split(/\s+/);
  const result: string[] = [];

  for (const word of words) {
    if (!word) continue;

    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    const parts = cleanWord.split('-');

    if (parts.length > 1) {
      if (parts[0] && parts[1] && (parts[1].startsWith(parts[0]) || parts[0].startsWith(parts[1]))) {
        // Keep only the complete word
        result.push(parts[1]);
        continue;
      }
    }

    result.push(word);
  }

  return result.join(' ');
}

export function analyzeSpeechPatterns(text: string): {
  fillerWords: string[];
  repetitions: string[];
  stutters: string[];
} {
  const words = text.split(/\s+/);
  const fillerWords = new Set(['um', 'umm', 'uh', 'uhh', 'like', 'you know', 'so', 'well', 'actually', 'basically', 'literally']);
  const detectedFillers: string[] = [];
  const detectedRepetitions: string[] = [];
  const detectedStutters: string[] = [];

  // Find filler words
  for (const word of words) {
    if (!word) continue;
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    if (fillerWords.has(cleanWord)) {
      detectedFillers.push(word);
    }
  }

  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] && words[i + 1] &&
        words[i]!.toLowerCase() === words[i + 1]!.toLowerCase()) {
      detectedRepetitions.push(words[i]!);
    }
  }

  for (const word of words) {
    if (!word) continue;
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    const parts = cleanWord.split('-');

    if (parts.length > 1) {
      if (parts[0] && parts[1] && (parts[1].startsWith(parts[0]) || parts[0].startsWith(parts[1]))) {
        detectedStutters.push(word);
      }
    }
  }

  return {
    fillerWords: detectedFillers,
    repetitions: Array.from(new Set(detectedRepetitions)), // Remove duplicates
    stutters: detectedStutters
  };
}

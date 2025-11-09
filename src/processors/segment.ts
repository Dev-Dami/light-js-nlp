import type { PipelineComponent } from "../core/types";
import { IntentResult } from "../types";

export const segment: PipelineComponent = (
  input: IntentResult,
): IntentResult => {
  const sentences = input.text
    .split(/(?<=[.?!])\s+/)
    .filter((s) => s.trim().length > 0);

  let position = 0;
  for (const sentence of sentences) {
    const start = input.text.indexOf(sentence, position);
    if (start !== -1) {
      input.entities.push({
        type: "sentence",
        value: sentence.trim(),
        start,
        end: start + sentence.trim().length,
      });
      position = start + sentence.length;
    }
  }

  return input;
};

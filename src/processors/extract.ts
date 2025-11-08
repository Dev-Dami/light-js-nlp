import { PipelineComponent } from "../core/pipeline";
import { IntentResult } from "../types";

export const extract: PipelineComponent = (input: IntentResult): IntentResult => {
  // Extract entities based on patterns
  const entityPatterns = [
    { type: "email", regex: /\b[\w.-]+@[\w.-]+\.\w{2,}\b/g },
    { type: "phone", regex: /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g },
    { type: "url", regex: /https?:\/\/[\w.-]+\.[\w.-]+(?:\/[\w.-]*)*/g },
    { type: "number", regex: /\b\d+(?:\.\d+)?\b/g },
  ];

  for (const pattern of entityPatterns) {
    let match;
    while ((match = pattern.regex.exec(input.text)) !== null) {
      input.entities.push({
        type: pattern.type,
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  }

  return input;
};

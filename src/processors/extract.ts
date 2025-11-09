import type { PipelineComponent } from "../core/types";
import { IntentResult } from "../types";

export const extract: PipelineComponent = (
  input: IntentResult,
): IntentResult => {
  try {
    extractEmails(input);
  } catch (e) {
    console.warn("Email extraction failed:", e);
  }

  try {
    extractPhones(input);
  } catch (e) {
    console.warn("Phone extraction failed:", e);
  }

  try {
    extractUrls(input);
  } catch (e) {
    console.warn("URL extraction failed:", e);
  }

  try {
    extractNumbers(input);
  } catch (e) {
    console.warn("Number extraction failed:", e);
  }

  return input;
};

export const extractEmailsOnly: PipelineComponent = (
  input: IntentResult,
): IntentResult => {
  try {
    extractEmails(input);
  } catch (e) {
    console.warn("Email extraction failed:", e);
  }
  return input;
};

export const extractPhonesOnly: PipelineComponent = (
  input: IntentResult,
): IntentResult => {
  try {
    extractPhones(input);
  } catch (e) {
    console.warn("Phone extraction failed:", e);
  }
  return input;
};

export const extractUrlsOnly: PipelineComponent = (
  input: IntentResult,
): IntentResult => {
  try {
    extractUrls(input);
  } catch (e) {
    console.warn("URL extraction failed:", e);
  }
  return input;
};

export const extractNumbersOnly: PipelineComponent = (
  input: IntentResult,
): IntentResult => {
  try {
    extractNumbers(input);
  } catch (e) {
    console.warn("Number extraction failed:", e);
  }
  return input;
};

function extractEmails(input: IntentResult): void {
  const text = input.text;
  const processedEmails = new Set<string>();

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "@") {
      const startSearch = Math.max(0, i - 30);
      const endSearch = Math.min(text.length, i + 30);

      let start = i;
      for (let j = i - 1; j >= startSearch; j--) {
        const char = text[j];
        if (char === undefined || !/[a-zA-Z0-9._%+-]/.test(char)) {
          start = j + 1;
          break;
        }
        if (j === startSearch) {
          start = j;
        }
      }

      let end = i;
      for (let j = i + 1; j < endSearch; j++) {
        const char = text[j];
        if (char === undefined || !/[a-zA-Z0-9.-]/.test(char)) {
          end = j;
          break;
        }
        if (j === endSearch - 1) {
          end = j + 1;
        }
      }

      if (start < i && i < end) {
        const potentialEmail = text.substring(start, end);
        if (
          isValidEmail(potentialEmail) &&
          !processedEmails.has(potentialEmail)
        ) {
          input.entities.push({
            type: "email",
            value: potentialEmail,
            start,
            end,
          });
          processedEmails.add(potentialEmail);
        }
      }
    }
  }
}

function isValidEmail(str: string): boolean {
  if (!str.includes("@")) return false;
  const parts = str.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;
  if (!localPart || !domainPart) return false;
  if (!domainPart.includes(".")) return false;

  if (!/^[a-zA-Z0-9._%+-]+$/.test(localPart)) return false;
  if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) return false;

  return true;
}

function extractPhones(input: IntentResult): void {
  const text = input.text;
  const maxIterations = text.length;
  let iterations = 0;

  for (
    let i = 0;
    i < text.length && iterations < maxIterations;
    i++, iterations++
  ) {
    const char = text[i];
    if ((char && isDigit(char)) || char === "+" || char === "(") {
      let phoneEnd = i;
      let digitCount = 0;
      let validPhoneChars = 0;
      const lookAheadLimit = Math.min(text.length, i + 20);

      while (phoneEnd < lookAheadLimit) {
        const c = text[phoneEnd];
        if (c && isDigit(c)) {
          digitCount++;
          validPhoneChars++;
        } else if (c && ["-", ".", " ", "(", ")", "+"].includes(c)) {
          validPhoneChars++;
        } else {
          break;
        }
        phoneEnd++;
      }

      if (
        digitCount >= 10 &&
        digitCount <= 15 &&
        validPhoneChars === phoneEnd - i
      ) {
        const potentialPhone = text.substring(i, phoneEnd);
        const existing = input.entities.find(
          (e) => e.value === potentialPhone && e.type === "phone",
        );
        if (
          !existing &&
          !input.entities.some(
            (e) => e.value === potentialPhone && e.type === "phone",
          )
        ) {
          input.entities.push({
            type: "phone",
            value: potentialPhone,
            start: i,
            end: phoneEnd,
          });
        }
        i = phoneEnd - 1;
      }
    }
  }
}

function extractUrls(input: IntentResult): void {
  const text = input.text;
  const protocols = ["http://", "https://"];

  for (const protocol of protocols) {
    let searchStart = 0;
    while (searchStart < text.length) {
      const protocolIndex = text.indexOf(protocol, searchStart);
      if (protocolIndex === -1) break;

      let urlEnd = protocolIndex + protocol.length;
      while (urlEnd < text.length) {
        const char = text[urlEnd];
        if (
          char === undefined ||
          [
            " ",
            "\n",
            "\r",
            "\t",
            "<",
            ">",
            "(",
            ")",
            "[",
            "]",
            "{",
            "}",
          ].includes(char)
        ) {
          break;
        }
        urlEnd++;
      }

      const url = text.substring(protocolIndex, urlEnd);
      if (url && isValidUrl(url)) {
        input.entities.push({
          type: "url",
          value: url,
          start: protocolIndex,
          end: urlEnd,
        });
      }

      searchStart = urlEnd > searchStart ? urlEnd : searchStart + 1;
    }
  }
}

function isValidUrl(url: string): boolean {
  const parts = url.split("://");
  if (parts.length !== 2) return false;

  const protocol = parts[0];
  const path = parts[1];

  if (!protocol || !path || !["http", "https"].includes(protocol)) return false;

  const domainPath = path.split("/")[0];
  if (!domainPath) return false;

  const domainParts = domainPath.split(".");
  if (domainParts.length < 2) return false;

  for (const part of domainParts) {
    if (!part || !/^[a-zA-Z0-9-]+$/.test(part)) {
      return false;
    }
  }

  return true;
}

function extractNumbers(input: IntentResult): void {
  const text = input.text;
  let i = 0;

  while (i < text.length) {
    while (i < text.length) {
      const currentChar = text[i];
      if (
        currentChar !== undefined &&
        (isDigit(currentChar) || currentChar === ".")
      ) {
        break;
      }
      i++;
    }

    if (i >= text.length) break;

    let start = i;
    let hasDecimal = false;
    let validNumber = false;

    while (i < text.length) {
      const char = text[i];
      if (char === undefined) {
        break;
      }

      if (isDigit(char)) {
        validNumber = true;
        i++;
      } else if (char === "." && !hasDecimal) {
        const prevChar = text[i - 1];
        const nextChar = text[i + 1];
        if (
          i > 0 &&
          prevChar !== undefined &&
          isDigit(prevChar) &&
          i < text.length - 1 &&
          nextChar !== undefined &&
          isDigit(nextChar)
        ) {
          hasDecimal = true;
          validNumber = true;
          i++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    if (i > start && validNumber) {
      const numberValue = text.substring(start, i);
      if (isNumber(numberValue)) {
        input.entities.push({
          type: "number",
          value: numberValue,
          start,
          end: i,
        });
      }
    } else if (i === start) {
      i++;
    }
  }
}

function isDigit(char: string | undefined): boolean {
  if (char === undefined) return false;
  return char >= "0" && char <= "9";
}

function isNumber(str: string): boolean {
  return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
}

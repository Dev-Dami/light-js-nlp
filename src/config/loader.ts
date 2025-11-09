import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { defaultConfig, type MiniparseConfig } from "./defaults";

export class ConfigLoader {
  private static readonly CONFIG_FILE_NAME = "miniparse.config.yaml";
  private static readonly DEFAULT_CONFIG_FILE_NAME = "default.yaml";

  public static loadConfig(customConfigPath?: string): MiniparseConfig {
    if (customConfigPath && fs.existsSync(customConfigPath)) {
      return this.loadConfigFromFile(customConfigPath);
    }

    const localConfigPath = path.join(process.cwd(), this.CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
      return this.loadConfigFromFile(localConfigPath);
    }

    const defaultConfigPath = path.join(
      __dirname,
      "../..",
      this.DEFAULT_CONFIG_FILE_NAME,
    );
    if (fs.existsSync(defaultConfigPath)) {
      return this.loadConfigFromFile(defaultConfigPath);
    }
    return JSON.parse(JSON.stringify(defaultConfig));
  }

  private static loadConfigFromFile(filePath: string): MiniparseConfig {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");

      const configObject = yaml.load(fileContent) as Partial<MiniparseConfig>;

      if (configObject === null || typeof configObject !== "object") {
        throw new Error("YAML file did not contain a valid object");
      }
      return this.mergeConfigWithDefaults(configObject);
    } catch (error) {
      console.warn(`Failed to load config from ${filePath}:`, error);
      console.warn("Falling back to default configuration");
      return JSON.parse(JSON.stringify(defaultConfig));
    }
  }

  private static parseYAMLToJSON(yamlStr: string): Partial<MiniparseConfig> {
    const lines = yamlStr.split("\n");
    const result: any = {};
    const stack: any[] = [result];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const match = line.match(/^(\s*)([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (
        match &&
        match[1] !== undefined &&
        match[2] !== undefined &&
        match[3] !== undefined
      ) {
        const indent = match[1].length;
        const key = match[2];
        const value = match[3].trim();

        while (stack.length > 1) {
          const currentIndentLevel = getIndentLevel(stack[stack.length - 1]);
          if (indent < currentIndentLevel) {
            stack.pop();
          } else {
            break;
          }
        }

        const currentObj = stack[stack.length - 1];
        if (!currentObj) continue;

        if (value === "") {
          currentObj[key] = {};
          const newObj = currentObj[key];
          if (newObj) {
            stack.push(newObj);
            setIndentLevel(newObj, indent);
          }
        } else {
          currentObj[key] = this.parseYAMLValue(value);
        }
      }
    }

    return result;
  }

  private static parseYAMLValue(value: string): any {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
    if (value === "null") return null;
    if (value === "undefined") return undefined;
    const num = Number(value);
    if (!isNaN(num)) return num;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.substring(1, value.length - 1);
    }

    return value;
  }

  private static mergeConfigWithDefaults(
    partialConfig: Partial<MiniparseConfig>,
  ): MiniparseConfig {
    const config: any = JSON.parse(JSON.stringify(defaultConfig));

    this.deepMerge(config, partialConfig);

    return config as MiniparseConfig;
  }

  private static deepMerge(target: any, source: any): void {
    for (const key in source) {
      if (source && source.hasOwnProperty(key)) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          if (!target[key]) target[key] = {};
          this.deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }
}
// Helper functions for YAML parsing
const indentLevels = new WeakMap<object, number>();

function getIndentLevel(obj: object): number {
  return indentLevels.get(obj) || 0;
}

function setIndentLevel(obj: object, level: number): void {
  indentLevels.set(obj, level);
}

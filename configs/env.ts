export type EnvironmentVariableType = "string" | "int" | "float" | "boolean";

export function loadRequiredEnvironmentVariable(
    key: string,
    asType: Extract<EnvironmentVariableType, "string">
  ): string;
  export function loadRequiredEnvironmentVariable(
    key: string,
    asType: Extract<EnvironmentVariableType, "int">
  ): number;
  export function loadRequiredEnvironmentVariable(
    key: string,
    asType: Extract<EnvironmentVariableType, "float">
  ): number;
  export function loadRequiredEnvironmentVariable(
    key: string,
    asType: Extract<EnvironmentVariableType, "boolean">
  ): boolean;
  export function loadRequiredEnvironmentVariable(
    key: string,
    asType: EnvironmentVariableType
  ) {
    const val = process.env?.[key];
    if (!val)
      throw Error(`Required environment variable has not been set: ${key}`);
    console.info(`Loaded environment variable: ${key} = ${val}`)
    switch (asType) {
      case "int":
        return parseInt(val);
      case "float":
        return parseFloat(val);
      case "boolean":
        return ["true", "yes", "y", "1"].includes(val.toLowerCase()) ? true : false;
      case "string":
        return val;
      default:
        throw Error(`Unrecognised type: ${asType}`)
    }
  }
  
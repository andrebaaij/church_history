export type ValidationError = { file?: string; path: string; message: string };

export function formatErrors(errors: ValidationError[]): string {
  return errors.map((e) => `${e.file ?? "(dataset)"} › ${e.path || "(root)"}: ${e.message}`).join("\n");
}

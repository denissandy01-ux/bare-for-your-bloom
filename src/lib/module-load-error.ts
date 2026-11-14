/** Browsers use different messages when a lazy route script cannot be fetched. */
export function isModuleLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Loading chunk .+ failed|Unable to preload CSS/i.test(message);
}
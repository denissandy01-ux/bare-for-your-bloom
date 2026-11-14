import { describe, expect, it } from 'vitest';
import { isModuleLoadError } from '@/lib/module-load-error';
describe('route script recovery', () => {
  it('recognizes the reported Safari module failure', () => {
    expect(isModuleLoadError(new TypeError('Importing a module script failed.'))).toBe(true);
  });
  it('recognizes Chromium and Firefox script fetch failures', () => {
    expect(isModuleLoadError(new TypeError('Failed to fetch dynamically imported module: /assets/feed.js'))).toBe(true);
    expect(isModuleLoadError(new TypeError('error loading dynamically imported module: /assets/feed.js'))).toBe(true);
  });
  it('does not reload for unrelated application errors', () => {
    expect(isModuleLoadError(new Error('Permission denied'))).toBe(false);
    expect(isModuleLoadError(null)).toBe(false);
  });
});
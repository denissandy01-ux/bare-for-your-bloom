import { describe, expect, it, vi } from 'vitest';
import { shareLink } from '../lib/share';
describe('Share link', () => {
  const url = 'https://example.com/?post=p1';
  it('shares the original URL natively', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    expect(await shareLink({share}, 'Wear test', url)).toBe('shared');
    expect(share).toHaveBeenCalledWith({title: 'Wear test', url});
  });
  it('copies when native sharing is unavailable or fails', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await shareLink({share: vi.fn().mockRejectedValue(new Error('Unavailable')), clipboard: {writeText}}, 'Wear test', url)).toBe('copied');
    expect(writeText).toHaveBeenCalledWith(url);
  });
  it('does not copy after cancellation', async () => {
    const writeText = vi.fn();
    const error = new Error('Cancelled'); error.name = 'AbortError';
    expect(await shareLink({share: vi.fn().mockRejectedValue(error), clipboard: {writeText}}, 'Wear test', url)).toBe('cancelled');
    expect(writeText).not.toHaveBeenCalled();
  });
  it('allows manual copying when both browser APIs fail', async () => {
    expect(await shareLink({clipboard: {writeText: vi.fn().mockRejectedValue(new Error('Denied'))}}, 'Wear test', url)).toBe('manual');
  });
});
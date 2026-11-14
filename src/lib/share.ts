export type ShareBrowser = {
  share?: (data: { title: string; url: string }) => Promise<void>;
  clipboard?: { writeText: (text: string) => Promise<void> };
};
export async function shareLink(browser: ShareBrowser, title: string, url: string): Promise<'shared' | 'copied' | 'cancelled' | 'manual'> {
  if (browser.share) {
    try { await browser.share({ title, url }); return 'shared'; }
    catch (error) { if (error instanceof Error && error.name === 'AbortError') return 'cancelled'; }
  }
  if (browser.clipboard) {
    try { await browser.clipboard.writeText(url); return 'copied'; } catch { /* manual copy fallback */ }
  }
  return 'manual';
}
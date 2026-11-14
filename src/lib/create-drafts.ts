import type { z } from 'zod';
import type { postSchema } from './community';

export type PostFields = z.infer<typeof postSchema>;
export interface CreateDraft { id: string; ownerId: string; updated: string; mode: 'Video' | 'Photo' | 'Text'; fields: PostFields; file: File | null }
// IndexedDB stores media blobs without localStorage quotas or public uploads.
function openDrafts(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bare-create-drafts', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('drafts', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Drafts could not be opened on this device.'));
  });
}
export async function listCreateDrafts(ownerId: string): Promise<CreateDraft[]> {
  const db = await openDrafts();
  try { return await new Promise((resolve, reject) => {
    const request = db.transaction('drafts').objectStore('drafts').getAll();
    request.onsuccess = () => resolve((request.result as CreateDraft[]).filter(d => d.ownerId === ownerId).sort((a,b) => b.updated.localeCompare(a.updated)));
    request.onerror = () => reject(new Error('Drafts could not be loaded.'));
  }); } finally { db.close(); }
}
export async function saveCreateDraft(draft: CreateDraft) {
  const db = await openDrafts();
  try { await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('drafts', 'readwrite'); tx.objectStore('drafts').put(draft);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(new Error('Draft could not be saved. Your device may be out of space.'));
  }); } finally { db.close(); }
}
export async function deleteCreateDraft(id: string, ownerId: string) {
  if (!(await listCreateDrafts(ownerId)).some(d => d.id === id)) throw new Error('Draft not found in your account.');
  const db = await openDrafts();
  try { await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('drafts', 'readwrite'); tx.objectStore('drafts').delete(id);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(new Error('Draft could not be removed.'));
  }); } finally { db.close(); }
}
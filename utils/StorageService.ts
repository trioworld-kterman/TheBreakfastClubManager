
import { GroupData } from '../types';

export const LAST_KEY_STORAGE_KEY = 'bread_last_key';

export class StorageService {
  /**
   * Encodes the entire state into a Base64 string for URL sharing.
   */
  static encodeState(data: GroupData): string {
    try {
      const json = JSON.stringify(data);
      // We use encodeURIComponent to handle non-ASCII characters in names
      return btoa(encodeURIComponent(json));
    } catch (e) {
      console.error("Encoding failed", e);
      return "";
    }
  }

  /**
   * Decodes state from a Base64 string.
   */
  static decodeState(encoded: string): GroupData | null {
    try {
      const json = decodeURIComponent(atob(encoded));
      return JSON.parse(json);
    } catch (e) {
      console.error("Decoding failed", e);
      return null;
    }
  }

  /**
   * Local persistence for the "Login" experience.
   */
  static saveLocal(key: string, data: GroupData) {
    localStorage.setItem(`bread_v11_${key}`, JSON.stringify(data));
  }

  static loadLocal(key: string): GroupData | null {
    const saved = localStorage.getItem(`bread_v11_${key}`);
    return saved ? JSON.parse(saved) : null;
  }

  static setLastKey(key: string) {
    localStorage.setItem(LAST_KEY_STORAGE_KEY, key);
  }

  static getLastKey(): string | null {
    return localStorage.getItem(LAST_KEY_STORAGE_KEY);
  }
}

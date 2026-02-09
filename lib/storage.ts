import { SavedState } from './types';

const STORAGE_KEY = 'facility_vision_progress';

export function saveProgress(state: SavedState): void {
  try {
    const data = JSON.stringify({
      ...state,
      lastUpdated: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, data);
  } catch {
    // localStorage full or unavailable — gracefully degrade
    console.warn('Could not save progress to localStorage');
  }
}

export function loadProgress(): SavedState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as SavedState;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasExistingProgress(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

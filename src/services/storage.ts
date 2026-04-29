import { TreeNode } from '../types/tree';

const STORAGE_KEY = 'nex-flow-tree-data';

export function saveToStorage(projects: TreeNode[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // storage full or unavailable
  }
}

export function loadFromStorage(): TreeNode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TreeNode[];
  } catch {
    return [];
  }
}

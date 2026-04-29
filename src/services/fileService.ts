import { TreeNode, AppData } from '../types/tree';

const CURRENT_VERSION = '1.0';

export function exportToJson(projects: TreeNode[]): void {
  const data: AppData = {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    projects,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nex-flow-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File): Promise<TreeNode[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed)) {
          resolve(parsed as TreeNode[]);
        } else if (parsed?.projects && Array.isArray(parsed.projects)) {
          resolve(parsed.projects as TreeNode[]);
        } else {
          reject(new Error('Formato de arquivo inválido'));
        }
      } catch {
        reject(new Error('Arquivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsText(file);
  });
}

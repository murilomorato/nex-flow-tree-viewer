export type NodeType =
  | 'project'
  | 'epic'
  | 'grouping'
  | 'feature_component'
  | 'structural_component'
  | 'value_change'
  | 'structural_challenge'
  | 'artifact';

export type NodeStatus =
  | 'mapped'
  | 'rising'
  | 'top'
  | 'falling'
  | 'completed';

export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  status?: NodeStatus;
  children: TreeNode[];
  collapsed: boolean;
}

export interface AppData {
  version: string;
  exportedAt: string;
  projects: TreeNode[];
}

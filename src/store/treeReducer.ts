import { TreeNode, NodeStatus, NodeType } from '../types/tree';

export interface State {
  projects: TreeNode[];
}

export type Action =
  | { type: 'ADD_NODE'; parentId: string | null; node: TreeNode }
  | { type: 'EDIT_NODE'; id: string; label: string; nodeType: NodeType; status?: NodeStatus }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'TOGGLE_COLLAPSE'; id: string }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'EXPAND_ALL' }
  | { type: 'LOAD_DATA'; projects: TreeNode[] };

function mapNodes(nodes: TreeNode[], id: string, fn: (n: TreeNode) => TreeNode): TreeNode[] {
  return nodes.map(n =>
    n.id === id ? fn(n) : { ...n, children: mapNodes(n.children, id, fn) }
  );
}

function filterNodes(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter(n => n.id !== id)
    .map(n => ({ ...n, children: filterNodes(n.children, id) }));
}

function setCollapsed(nodes: TreeNode[], collapsed: boolean): TreeNode[] {
  return nodes.map(n => ({ ...n, collapsed, children: setCollapsed(n.children, collapsed) }));
}

export function treeReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_NODE':
      if (action.parentId === null) {
        return { projects: [...state.projects, action.node] };
      }
      return {
        projects: mapNodes(state.projects, action.parentId, n => ({
          ...n,
          collapsed: false,
          children: [...n.children, action.node],
        })),
      };

    case 'EDIT_NODE':
      return {
        projects: mapNodes(state.projects, action.id, n => ({
          ...n,
          label: action.label,
          type: action.nodeType,
          status: action.status,
        })),
      };

    case 'DELETE_NODE':
      return { projects: filterNodes(state.projects, action.id) };

    case 'TOGGLE_COLLAPSE':
      return {
        projects: mapNodes(state.projects, action.id, n => ({
          ...n,
          collapsed: !n.collapsed,
        })),
      };

    case 'COLLAPSE_ALL':
      return { projects: setCollapsed(state.projects, true) };

    case 'EXPAND_ALL':
      return { projects: setCollapsed(state.projects, false) };

    case 'LOAD_DATA':
      return { projects: action.projects };

    default:
      return state;
  }
}

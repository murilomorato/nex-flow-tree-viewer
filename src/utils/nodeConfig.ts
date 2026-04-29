import { NodeType, NodeStatus } from '../types/tree';

export interface NodeConfig {
  label: string;
  icon?: string;
  prefix?: string;
  hasStatus: boolean;
  color: string;
  fontWeight?: number;
}

export const NODE_TYPES: NodeType[] = [
  'project',
  'epic',
  'grouping',
  'feature_component',
  'structural_component',
  'value_change',
  'structural_challenge',
  'artifact',
];

export const NODE_CONFIG: Record<NodeType, NodeConfig> = {
  project:              { label: 'Projeto',               prefix: 'Projeto',       hasStatus: false, color: '#4f46e5', fontWeight: 700 },
  epic:                 { label: 'Épico',                 prefix: 'Épico',         hasStatus: false, color: '#7c3aed', fontWeight: 600 },
  grouping:             { label: 'Agrupamento',           prefix: 'Agrupamento',   hasStatus: false, color: '#475569', fontWeight: 500 },
  feature_component:    { label: 'Componente Feature',    icon: '🌍',              hasStatus: false, color: '#0284c7' },
  structural_component: { label: 'Componente Estrutural', icon: '⚙️',             hasStatus: false, color: '#b45309' },
  value_change:         { label: 'Mudança de Valor',      icon: '✨',              hasStatus: false, color: '#059669' },
  structural_challenge: { label: 'Desafio Estrutural',    icon: '🧠',              hasStatus: true,  color: '#c2410c' },
  artifact:             { label: 'Artefato',              icon: '🧱',              hasStatus: true,  color: '#64748b' },
};

export const STATUS_CONFIG: Record<NodeStatus, { label: string; icon: string }> = {
  mapped:    { label: 'Mapeado',   icon: '⚪' },
  rising:    { label: 'Subida',    icon: '🔺' },
  top:       { label: 'Topo',      icon: '🟨' },
  falling:   { label: 'Descida',   icon: '🔽' },
  completed: { label: 'Concluído', icon: '✅' },
};

export const NODE_STATUSES: NodeStatus[] = ['mapped', 'rising', 'top', 'falling', 'completed'];

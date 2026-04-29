import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TreeNode, NodeType } from '../../types/tree';
import { NODE_CONFIG, STATUS_CONFIG } from '../../utils/nodeConfig';

export interface AncestorInfo {
  label: string;
  type: NodeType;
}

interface Props {
  node: TreeNode;
  ancestors: AncestorInfo[];
  onClose: () => void;
}

export function DescriptionPanel({ node, ancestors, onClose }: Props) {
  const config = NODE_CONFIG[node.type];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="desc-overlay" onClick={onClose}>
      <div className="desc-panel" onClick={e => e.stopPropagation()}>

        <div className="desc-panel-header">
          <nav className="desc-breadcrumb">
            {ancestors.map((a, i) => (
              <span key={i} className="desc-breadcrumb-item">
                <span style={{ color: NODE_CONFIG[a.type].color }}>{a.label}</span>
                <span className="desc-sep">›</span>
              </span>
            ))}
            <strong style={{ color: config.color }}>{node.label}</strong>
          </nav>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className="desc-panel-body">
          <div className="desc-node-title">
            {config.icon && <span className="desc-node-icon">{config.icon}</span>}
            <span>{node.label}</span>
            {node.status && (
              <span className="desc-node-status">{STATUS_CONFIG[node.status].icon}</span>
            )}
          </div>
          <span
            className="desc-type-badge"
            style={{ color: config.color, background: config.color + '18' }}
          >
            {config.label}
          </span>

          <div className="desc-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {node.description ?? ''}
            </ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
}

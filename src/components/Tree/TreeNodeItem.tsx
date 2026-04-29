import { useState } from 'react';
import { TreeNode, NodeType, NodeStatus } from '../../types/tree';
import { NODE_CONFIG, STATUS_CONFIG } from '../../utils/nodeConfig';
import { NodeFormModal } from '../Modal/NodeFormModal';
import { DescriptionPanel, AncestorInfo } from '../DescriptionPanel/DescriptionPanel';

interface Props {
  node: TreeNode;
  depth: number;
  ancestors: AncestorInfo[];
  onAddChild: (parentId: string | null, node: TreeNode) => void;
  onEdit: (id: string, label: string, nodeType: NodeType, status?: NodeStatus, description?: string) => void;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onDragStart: (id: string) => void;
  onDrop: (targetId: string) => void;
  onDragEnd: () => void;
}

export function TreeNodeItem({ node, depth, ancestors, onAddChild, onEdit, onDelete, onToggleCollapse, onDragStart, onDrop, onDragEnd }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDescPanel, setShowDescPanel] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const config = NODE_CONFIG[node.type];
  const hasChildren = node.children.length > 0;
  const hasDescription = Boolean(node.description);

  const childAncestors: AncestorInfo[] = [...ancestors, { label: node.label, type: node.type }];

  return (
    <div className="tree-node">
      <div
        className={`tree-node-row${isDragging ? ' dragging' : ''}${isDragOver ? ' drag-over' : ''}`}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          onDragStart(node.id);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          setIsDragOver(false);
          onDragEnd();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          onDrop(node.id);
        }}
      >
        <span className="drag-handle" title="Arrastar para mover">⠿</span>

        <button
          className={`collapse-btn${!hasChildren ? ' invisible' : ''}`}
          onClick={() => hasChildren && onToggleCollapse(node.id)}
          aria-label={node.collapsed ? 'Expandir' : 'Colapsar'}
          tabIndex={hasChildren ? 0 : -1}
        >
          {hasChildren ? (node.collapsed ? '▶' : '▼') : null}
        </button>

        <span
          className="node-label"
          style={{ color: config.color, fontWeight: config.fontWeight ?? 400 }}
        >
          {config.icon && <span className="node-icon">{config.icon}</span>}
          {config.prefix && <span className="node-prefix">{config.prefix}: </span>}
          {node.label}
          {node.status && (
            <span className="node-status">{STATUS_CONFIG[node.status].icon}</span>
          )}
          {hasDescription && (
            <button
              className="desc-icon-btn"
              onClick={() => setShowDescPanel(true)}
              title="Ver descrição"
              aria-label="Ver descrição"
            >
              💬
            </button>
          )}
        </span>

        <div className="node-actions">
          <button
            className="action-btn"
            onClick={() => setShowAddModal(true)}
            title="Adicionar filho"
          >
            +
          </button>
          <button
            className="action-btn"
            onClick={() => setShowEditModal(true)}
            title="Editar"
          >
            ✏️
          </button>
          <button
            className="action-btn action-btn-delete"
            onClick={() => setShowDeleteConfirm(true)}
            title="Deletar"
          >
            🗑
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm" style={{ paddingLeft: '44px' }}>
          <span>Deletar &ldquo;{node.label}&rdquo;{hasChildren ? ' e todos os filhos' : ''}?</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => { onDelete(node.id); setShowDeleteConfirm(false); }}
          >
            Confirmar
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancelar
          </button>
        </div>
      )}

      {!node.collapsed && node.children.length > 0 && (
        <div className="tree-children">
          {node.children.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              ancestors={childAncestors}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleCollapse={onToggleCollapse}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <NodeFormModal
          mode="add"
          parentId={node.id}
          onSubmit={onAddChild}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && (
        <NodeFormModal
          mode="edit"
          node={node}
          onSubmit={onEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDescPanel && (
        <DescriptionPanel
          node={node}
          ancestors={ancestors}
          onClose={() => setShowDescPanel(false)}
        />
      )}
    </div>
  );
}

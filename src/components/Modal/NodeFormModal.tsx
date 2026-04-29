import React, { useState } from 'react';
import { Modal } from './Modal';
import { NodeType, NodeStatus, TreeNode } from '../../types/tree';
import { NODE_CONFIG, NODE_TYPES, STATUS_CONFIG, NODE_STATUSES } from '../../utils/nodeConfig';
import { generateId } from '../../utils/id';

const MAX_DESC = 1000;

interface AddProps {
  mode: 'add';
  parentId: string | null;
  onSubmit: (parentId: string | null, node: TreeNode) => void;
  onClose: () => void;
}

interface EditProps {
  mode: 'edit';
  node: TreeNode;
  onSubmit: (id: string, label: string, nodeType: NodeType, status?: NodeStatus, description?: string) => void;
  onClose: () => void;
}

type Props = AddProps | EditProps;

export function NodeFormModal(props: Props) {
  const isEdit = props.mode === 'edit';

  const [label, setLabel] = useState(isEdit ? props.node.label : '');
  const [nodeType, setNodeType] = useState<NodeType>(isEdit ? props.node.type : 'epic');
  const [status, setStatus] = useState<NodeStatus | ''>(
    isEdit ? (props.node.status ?? '') : ''
  );
  const [description, setDescription] = useState(isEdit ? (props.node.description ?? '') : '');

  const config = NODE_CONFIG[nodeType];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;

    const resolvedStatus = config.hasStatus && status ? (status as NodeStatus) : undefined;
    const resolvedDescription = description.trim() || undefined;

    if (isEdit) {
      props.onSubmit(props.node.id, label.trim(), nodeType, resolvedStatus, resolvedDescription);
    } else {
      const newNode: TreeNode = {
        id: generateId(),
        label: label.trim(),
        type: nodeType,
        status: resolvedStatus,
        description: resolvedDescription,
        children: [],
        collapsed: false,
      };
      props.onSubmit(props.parentId, newNode);
    }
    props.onClose();
  }

  return (
    <Modal title={isEdit ? 'Editar nó' : 'Adicionar nó'} onClose={props.onClose}>
      <form onSubmit={handleSubmit} className="node-form">
        <div className="form-group">
          <label htmlFor="node-type">Tipo</label>
          <select
            id="node-type"
            value={nodeType}
            onChange={e => {
              setNodeType(e.target.value as NodeType);
              setStatus('');
            }}
          >
            {NODE_TYPES.map(t => (
              <option key={t} value={t}>
                {NODE_CONFIG[t].icon ? `${NODE_CONFIG[t].icon} ` : ''}
                {NODE_CONFIG[t].label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="node-label">Nome</label>
          <input
            id="node-label"
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Nome do nó"
            autoFocus
          />
        </div>

        {config.hasStatus && (
          <div className="form-group">
            <label htmlFor="node-status">Status</label>
            <select
              id="node-status"
              value={status}
              onChange={e => setStatus(e.target.value as NodeStatus | '')}
            >
              <option value="">Sem status</option>
              {NODE_STATUSES.map(s => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="node-desc">
            Descrição
            <span className="desc-char-count" style={{ color: description.length >= MAX_DESC ? 'var(--danger)' : undefined }}>
              {description.length} / {MAX_DESC}
            </span>
          </label>
          <textarea
            id="node-desc"
            className="desc-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descrição opcional. Suporta markdown."
            maxLength={MAX_DESC}
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={props.onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={!label.trim()}>
            {isEdit ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

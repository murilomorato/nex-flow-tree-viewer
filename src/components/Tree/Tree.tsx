import { useRef, useState } from 'react';
import { useTreeContext } from '../../store/TreeContext';
import { TreeNode, NodeType, NodeStatus } from '../../types/tree';
import { TreeNodeItem } from './TreeNodeItem';
import { NodeFormModal } from '../Modal/NodeFormModal';

export function Tree() {
  const { state, dispatch } = useTreeContext();
  const [showAddProject, setShowAddProject] = useState(false);
  const draggingId = useRef<string | null>(null);

  function handleAddChild(parentId: string | null, node: TreeNode) {
    dispatch({ type: 'ADD_NODE', parentId, node });
  }

  function handleEdit(id: string, label: string, nodeType: NodeType, status?: NodeStatus) {
    dispatch({ type: 'EDIT_NODE', id, label, nodeType, status });
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_NODE', id });
  }

  function handleToggle(id: string) {
    dispatch({ type: 'TOGGLE_COLLAPSE', id });
  }

  function handleDragStart(id: string) {
    draggingId.current = id;
  }

  function handleDrop(targetId: string) {
    if (draggingId.current && draggingId.current !== targetId) {
      dispatch({ type: 'MOVE_NODE', nodeId: draggingId.current, newParentId: targetId });
    }
    draggingId.current = null;
  }

  function handleDragEnd() {
    draggingId.current = null;
  }

  if (state.projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌳</div>
        <p>Nenhum projeto ainda.</p>
        <button className="btn btn-primary" onClick={() => setShowAddProject(true)}>
          + Criar primeiro projeto
        </button>
        {showAddProject && (
          <NodeFormModal
            mode="add"
            parentId={null}
            onSubmit={handleAddChild}
            onClose={() => setShowAddProject(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="tree">
      <div className="tree-controls">
        <button className="btn btn-sm btn-ghost" onClick={() => dispatch({ type: 'COLLAPSE_ALL' })}>
          Colapsar tudo
        </button>
        <button className="btn btn-sm btn-ghost" onClick={() => dispatch({ type: 'EXPAND_ALL' })}>
          Expandir tudo
        </button>
        <button className="btn btn-sm btn-add" onClick={() => setShowAddProject(true)}>
          + Novo projeto
        </button>
      </div>

      <div className="tree-content">
        {state.projects.map(project => (
          <TreeNodeItem
            key={project.id}
            node={project}
            depth={0}
            onAddChild={handleAddChild}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleCollapse={handleToggle}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {showAddProject && (
        <NodeFormModal
          mode="add"
          parentId={null}
          onSubmit={handleAddChild}
          onClose={() => setShowAddProject(false)}
        />
      )}
    </div>
  );
}

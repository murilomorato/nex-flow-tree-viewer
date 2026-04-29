import React, { useRef, useState } from 'react';
import { useTreeContext } from '../../store/TreeContext';
import { exportToJson, importFromJson } from '../../services/fileService';
import { NODE_CONFIG, STATUS_CONFIG, NODE_STATUSES, NODE_TYPES } from '../../utils/nodeConfig';

export function Toolbar() {
  const { state, dispatch } = useTreeContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLegend, setShowLegend] = useState(false);

  function handleSave() {
    exportToJson(state.projects);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importFromJson(file)
      .then(projects => dispatch({ type: 'LOAD_DATA', projects }))
      .catch(err => alert(err.message));
    e.target.value = '';
  }

  return (
    <>
      <header className="toolbar">
        <div className="toolbar-title">
          <span className="logo">🌳</span>
          <h1>NexFlow</h1>
        </div>
        <div className="toolbar-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowLegend(v => !v)}
            title="Legenda"
          >
            {showLegend ? 'Fechar legenda' : 'Legenda'}
          </button>
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            Importar JSON
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Salvar JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
      </header>

      {showLegend && (
        <div className="legend">
          <div className="legend-section">
            <h3>Tipos de nó</h3>
            <div className="legend-grid">
              {NODE_TYPES.map(t => {
                const c = NODE_CONFIG[t];
                return (
                  <div key={t} className="legend-item">
                    <span className="legend-icon" style={{ color: c.color }}>
                      {c.icon ?? (c.prefix ? `${c.prefix}:` : t)}
                    </span>
                    <span className="legend-label">{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="legend-section">
            <h3>Status</h3>
            <div className="legend-grid">
              {NODE_STATUSES.map(s => {
                const c = STATUS_CONFIG[s];
                return (
                  <div key={s} className="legend-item">
                    <span className="legend-icon">{c.icon}</span>
                    <span className="legend-label">{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

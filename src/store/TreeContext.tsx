import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { treeReducer, State, Action } from './treeReducer';
import { loadFromStorage, saveToStorage } from '../services/storage';

interface TreeContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const TreeContext = createContext<TreeContextValue | null>(null);

export function TreeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(treeReducer, undefined, () => ({
    projects: loadFromStorage(),
  }));

  useEffect(() => {
    saveToStorage(state.projects);
  }, [state.projects]);

  return (
    <TreeContext.Provider value={{ state, dispatch }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTreeContext() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error('useTreeContext must be used inside TreeProvider');
  return ctx;
}

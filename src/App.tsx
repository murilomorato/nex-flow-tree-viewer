import { TreeProvider } from './store/TreeContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Tree } from './components/Tree/Tree';
import './App.css';

function App() {
  return (
    <TreeProvider>
      <div className="app">
        <Toolbar />
        <main className="main">
          <Tree />
        </main>
      </div>
    </TreeProvider>
  );
}

export default App;

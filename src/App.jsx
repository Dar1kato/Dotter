import { useState, useCallback } from 'react';
import PetriCanvas from './components/PetriCanvas';
import Sidebar from './components/Sidebar';
import { COLORS } from './constants';
import styles from './App.module.css';

export default function App() {
  const [painted, setPainted] = useState({});
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [erasing, setErasing] = useState(false);

  const handlePaint = useCallback((pt, isErasing) => {
    const key = `${pt.col},${pt.row}`;
    setPainted(prev => {
      if (isErasing) {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      } else {
        if (prev[key] === selectedColor) return prev;
        return { ...prev, [key]: selectedColor };
      }
    });
  }, [selectedColor]);

  const handleClear = () => {
    if (Object.keys(painted).length === 0) return;
    if (window.confirm('¿Limpiar todos los puntos?')) setPainted({});
  };

  const handleToggleEraser = () => setErasing(e => !e);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          Petri<span className={styles.logoSlash}>/</span>Paint
        </div>
        <div className={styles.headerMeta}>
          {Object.keys(painted).length} punto{Object.keys(painted).length !== 1 ? 's' : ''} pintados
          {erasing && <span className={styles.erasingBadge}>modo borrar</span>}
        </div>
      </header>

      <div className={styles.body}>
        <main className={styles.canvasPanel}>
          <div className={styles.glow} />
          <PetriCanvas
            painted={painted}
            onPaint={handlePaint}
            erasing={erasing}
          />
          <p className={styles.hint}>
            {erasing ? 'clic para borrar puntos' : 'clic o arrastra para pintar'}
          </p>
        </main>

        <Sidebar
          painted={painted}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          erasing={erasing}
          onToggleEraser={handleToggleEraser}
          onClear={handleClear}
        />
      </div>
    </div>
  );
}

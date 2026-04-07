import { useState } from 'react';
import { COLORS } from '../constants';
import styles from './Sidebar.module.css';

export default function Sidebar({ painted, selectedColor, onSelectColor, erasing, onToggleEraser, onClear }) {
  const [copied, setCopied] = useState(false);

  // Agrupar por color
  const byColor = {};
  for (const [key, hex] of Object.entries(painted)) {
    const [col, row] = key.split(',').map(Number);
    const colorObj = COLORS.find(c => c.hex === hex);
    const name = colorObj?.id || hex;
    if (!byColor[name]) byColor[name] = [];
    byColor[name].push([col, row]);
  }

  const total = Object.keys(painted).length;
  const jsonStr = JSON.stringify(byColor, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <aside className={styles.sidebar}>

      {/* Pallet */}
      <section className={styles.section}>
        <p className={styles.label}>Active Color</p>
        <div className={styles.paletteGrid}>
          {COLORS.map(c => (
            <button
              key={c.id}
              className={`${styles.swatch} ${!erasing && selectedColor === c.hex ? styles.swatchActive : ''}`}
              style={{ background: c.hex }}
              title={c.name}
              onClick={() => { onSelectColor(c.hex); if (erasing) onToggleEraser(); }}
              aria-label={c.name}
            />
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className={styles.section}>
        <p className={styles.label}>Tools</p>
        <div className={styles.toolsRow}>
          <button
            className={`${styles.toolBtn} ${erasing ? styles.toolActive : ''}`}
            onClick={onToggleEraser}
          >
            {erasing ? '✕ Erase Active' : 'Erase'}
          </button>
          <button className={`${styles.toolBtn} ${styles.toolDanger}`} onClick={onClear}>
            Clean
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.section}>
        <p className={styles.label}>Painted Dots</p>
        <div className={styles.chips}>
          {Object.entries(byColor).length === 0 ? (
            <p className={styles.empty}>No Dots...</p>
          ) : (
            Object.entries(byColor).map(([colorId, pts]) => {
              const c = COLORS.find(x => x.id === colorId);
              return (
                <div key={colorId} className={styles.chip}>
                  <span className={styles.chipDot} style={{ background: c?.hex || colorId }} />
                  <span className={styles.chipName}>{c?.name || colorId}</span>
                  <span className={styles.chipCount}>{pts.length}</span>
                </div>
              );
            })
          )}
        </div>
        <p className={styles.statTotal}>{total} dot{total !== 1 ? 's' : ''} in total</p>
      </section>

      {/* Output JSON */}
      <section className={`${styles.section} ${styles.outputSection}`}>
        <div className={styles.outputHeader}>
          <p className={styles.label} style={{ marginBottom: 0 }}>Coordinates JSON</p>
          <button className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre className={styles.pre}>{jsonStr}</pre>
      </section>

    </aside>
  );
}

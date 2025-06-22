import React from 'react';
import styles from '../../styles/components/data-export.module.scss';

interface MapPrintButtonProps {
  label?: string;
}

export const MapPrintButton: React.FC<MapPrintButtonProps> = ({ label = 'Print Map' }) => {
  const handleClick = () => {
    window.print();
  };

  return (
    <button onClick={handleClick} className={styles.exportButton} aria-label="Print map">
      <span className={styles.icon}>🖨️</span>
      <span className={styles.text}>{label}</span>
    </button>
  );
};

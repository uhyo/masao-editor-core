import * as React from 'react';

import * as styles from './toolbar.css';

/**
 * A composable toolbar.
 */
export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}

interface IPropToolbox {
  label: string;
  children: React.ReactNode;
}
/**
 * Box in a toolbar.
 */
/**
 * One tool box.
 */
export function Toolbox({ label, children }: IPropToolbox) {
  return (
    <div>
      <div className={styles.toolboxLabel}>{label}</div>
      <div className={styles.toolboxRow}>{children}</div>
    </div>
  );
}

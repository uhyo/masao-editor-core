import * as React from 'react';

import * as styles from './toolbar.css';

/**
 * A composable toolbar.
 */
export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}

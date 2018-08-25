import * as React from 'react';
import * as styles from './screen-main.css';

/**
 * Wrapper of main part of screen.
 */
export const ScreenMainWrapper: React.StatelessComponent<{}> = ({
  children,
}) => {
  return <div className={styles.screenMain}>{children}</div>;
};

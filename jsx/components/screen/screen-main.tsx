import * as React from 'react';
import * as styles from './screen-main.css';

/**
 * Wrapper of main part of screen.
 */
export const ScreenMainWrapper: React.StatelessComponent<{
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={(className || '') + ' ' + styles.screenMain}>
      {children}
    </div>
  );
};

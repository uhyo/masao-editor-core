import * as React from 'react';

import * as styles from './styles.css';

/**
 * Wrapper of form controls set.
 */
export const FormControls: React.StatelessComponent<{}> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

/**
 * Text between controls.
 */
export const FormText: React.StatelessComponent<{}> = ({ children }) => {
  return <div className={styles.text}>{children}</div>;
};

/**
 * Wrapper of one form control.
 */
export const FormField: React.StatelessComponent<{
  name: string;
}> = ({ name, children }) => {
  return (
    <div className={styles.field}>
      <label>
        <b>{name}</b>
        <span>{children}</span>
      </label>
    </div>
  );
};

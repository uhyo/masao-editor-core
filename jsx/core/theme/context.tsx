import * as React from 'react';

/**
 * Context of theme.
 */
export interface ThemeContext {
  /**
   * Whether the editor fits the screen in the Y axis.
   */
  fitY: boolean;
}

const { Provider, Consumer } = React.createContext<ThemeContext>({
  fitY: false,
});

export { Provider as ThemeProvider, Consumer as ThemeConsumer };

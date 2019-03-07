import { useReducer } from 'react';

export interface MouseState {
  /**
   * Whether mouse is down now.
   */
  mouseIsDown: boolean;
}
export type MouseStateAction = {
  type: 'mouseIsDown';
  value: boolean;
};
export type MouseStateReducer = (
  state: MouseState,
  action: MouseStateAction,
) => MouseState;

const reducer: MouseStateReducer = (state, action) => {
  switch (action.type) {
    case 'mouseIsDown':
      return { ...state, mouseIsDown: action.value };
  }
};
/**
 * get a reducer for mouse state.
 */
export function useMouseState() {
  return useReducer(reducer, {
    mouseIsDown: false,
  });
}

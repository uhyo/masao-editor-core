//edit actions
import { Action, createAction } from '../../scripts/reflux-util';
import { ChipCode } from '../../scripts/chip';
import { ToolState } from './tool';
import { CursorState } from './cursor';

export { Action, ToolState, CursorState };

export type Mode =
  | 'pen'
  | 'eraser'
  | 'hand'
  | 'spuit'
  | 'rect'
  | 'fill'
  | 'select';

export type Screen =
  | 'map'
  | 'layer'
  | 'params'
  | 'project'
  | 'js'
  | 'custom-parts';

export type FocusPlace = 'main' | 'chipselect';
/**
 * Current state of pointer.
 */
export type PointerState = 'move';

export interface ChangeScreenAction {
  screen: Screen;
}
export const changeScreen = createAction<ChangeScreenAction>();

export interface ChangeStageAction {
  stage: number;
}
export const changeStage = createAction<ChangeStageAction>();

export interface ChangeModeAction {
  mode: Mode;
}
export const changeMode = createAction<ChangeModeAction>();

export interface ChangeViewAction {
  width: number;
  height: number;
  widthRemainder: number;
  heightRemainder: number;
}
export const changeView = createAction<ChangeViewAction>();

export interface ChangePenAction {
  pen: ChipCode;
  mode?: boolean;
}
export const changePen = createAction<ChangePenAction>({
  preEmit: (obj: ChangePenAction) => {
    if (obj == null) {
      return { pen: 0 };
    } else if (obj.pen == null) {
      return { pen: 0 };
    }
    return;
  },
});
export interface ChangePenLayerAction {
  pen: number;
  mode?: boolean;
}
export const changePenLayer = createAction<ChangePenLayerAction>({
  preEmit: (obj: ChangePenAction) => {
    if (obj == null) {
      return {
        pen: 0,
      };
    } else if (obj.pen == null) {
      return { pen: 0 };
    }
    return;
  },
});

export interface ChangeParamTypeAction {
  param_type: string;
}
export const changeParamType = createAction<ChangeParamTypeAction>();

export interface ChangeGridAction {
  grid: boolean;
}
export const changeGrid = createAction<ChangeGridAction>();

export interface ChangeRenderModeAction {
  render_map?: boolean;
  render_layer?: boolean;
}
export const changeRenderMode = createAction<ChangeRenderModeAction>();

export interface SetToolAction {
  tool: ToolState | null;
}
export const setTool = createAction<SetToolAction>();

export interface ScrollAction {
  x: number;
  y: number;
  stickRight: boolean;
  stickBottom: boolean;
}
export const scroll = createAction<ScrollAction>();

export interface ChangeChipselectSizeAction {
  width: number;
}
export const changeChipselectSize = createAction<ChangeChipselectSizeAction>();

export interface ChangeChipselectScrollAction {
  y: number;
}
export const changeChipselectScroll = createAction<
  ChangeChipselectScrollAction
>();

export interface SetCursorAction {
  cursor: CursorState | null;
}
export const setCursor = createAction<SetCursorAction>();

export interface SetFocusAction {
  focus: FocusPlace | null;
}
export const setFocus = createAction<SetFocusAction>();

export interface SetPointerAction {
  pointer: PointerState | null;
}
export const setPointer = createAction<SetPointerAction>();

export interface JsConfirmAction {
  confirm: boolean;
}
export const jsConfirm = createAction<JsConfirmAction>();

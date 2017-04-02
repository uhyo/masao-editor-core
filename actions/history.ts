import {
    Action,
    createAction,
} from '../scripts/reflux-util';
import {
    StageData,
} from '../stores/map';

export {
    Action,
};

export interface AddHistoryAction{
    stage: number;
    stageData: StageData;
}

export const addHistory = createAction<AddHistoryAction>();

export interface NewHistoryAction{
    stage: number;
    stageData: StageData;
}
export const newHistory = createAction<NewHistoryAction>();

export interface BackAction{
    stage: number;
}
export const back = createAction<BackAction>();

export interface ForwardAction{
    stage: number;
}
export const forward = createAction<ForwardAction>();

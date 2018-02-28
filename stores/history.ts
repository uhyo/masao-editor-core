// history
import { Store } from '../scripts/reflux-util';
import mapStore, { StageData } from './map';
import * as historyActions from '../actions/history';

export interface HistoryLine {
  prev: Array<StageData>;
  current: StageData;
  future: Array<StageData>;
}
// ステージごとに履歴を持つ
export interface HistoryState {
  buffer: number;
  data: Array<HistoryLine>;
}

export class HistoryStore extends Store<HistoryState> {
  constructor() {
    super();
    this.listenables = historyActions;
    this.state = {
      buffer: 256,
      data: mapStore.state.data.map(current => ({
        prev: [],
        current,
        future: [],
      })),
    };
  }
  public onAddHistory({ stage, stageData }: historyActions.AddHistoryAction) {
    this.setState({
      data: this.state.data.map((st, i) => {
        if (i === stage - 1) {
          const { prev, current } = st;
          const prev2 = [...prev, current];
          if (prev2.length > this.state.buffer) {
            prev2.shift();
          }
          return {
            prev: prev2,
            current: stageData,
            future: [],
          };
        } else {
          return st;
        }
      }),
    });
  }
  public onNewHistory({ stage, stageData }: historyActions.NewHistoryAction) {
    this.setState({
      data: this.state.data.map((st, i) => {
        if (i === stage - 1) {
          return {
            prev: [],
            current: stageData,
            future: [],
          };
        } else {
          return st;
        }
      }),
    });
  }
  public onBack({ stage }: historyActions.BackAction) {
    const { data } = this.state;
    const l = data[stage - 1].prev.length;
    if (l === 0) {
      return;
    }
    this.setState({
      data: data.map((st, i) => {
        if (i === stage - 1) {
          return {
            prev: st.prev.slice(0, l - 1),
            current: st.prev[l - 1],
            future: [st.current, ...st.future],
          };
        } else {
          return st;
        }
      }),
    });
  }
  public onForward({ stage }: historyActions.ForwardAction) {
    const { data } = this.state;
    if (data[stage - 1].future.length === 0) {
      return;
    }
    this.setState({
      data: data.map((st, i) => {
        if (i === stage - 1) {
          return {
            prev: [...st.prev, st.current],
            current: st.future[0],
            future: st.future.slice(1),
          };
        } else {
          return st;
        }
      }),
    });
  }
}

export default new HistoryStore();

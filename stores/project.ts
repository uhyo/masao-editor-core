import { Store } from '../scripts/reflux-util';
import * as projectActions from '../actions/project';

export interface ProjectState {
  version: '2.8' | 'fx16' | 'kani2';
  script: string;
}
export class ProjectStore extends Store<ProjectState> {
  constructor() {
    super();
    this.listenables = projectActions;
    // default version
    this.state = {
      version: 'fx16',
      script: '',
    };
  }
  public onChangeVersion({ version }: projectActions.ChangeVersionAction) {
    this.setState({
      version,
    });
  }
  public onChangeScript({ script }: projectActions.ChangeScriptAction) {
    this.setState({
      script,
    });
  }
}
export default new ProjectStore();

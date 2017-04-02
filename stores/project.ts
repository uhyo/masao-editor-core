import {
    Store,
} from '../scripts/reflux-util';
import * as projectActions from '../actions/project';

export interface ProjectState{
    version: '2.8' | 'fx16' | 'kani2';
}
export class ProjectStore extends Store<ProjectState>{
    constructor(){
        super();
        this.listenables = projectActions;
        // default version
        this.state = {
            version: 'fx16',
        };
    }
    public onChangeVersion({version}: projectActions.ChangeVersionAction){
        this.setState({
            version,
        });
    }
}
export default new ProjectStore();

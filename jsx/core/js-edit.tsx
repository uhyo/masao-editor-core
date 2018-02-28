import * as React from 'react';

import { ProjectState } from '../../stores/project';
import * as projectActions from '../../actions/project';

import * as styles from './css/js-edit.css';

export interface IPropJSEdit {
  project: ProjectState;
}
export default class JSEdit extends React.Component<IPropJSEdit, {}> {
  render() {
    const handleChange = () => {
      const textarea = this.refs.textarea as HTMLTextAreaElement;

      projectActions.changeScript({
        script: textarea.value,
      });
    };
    return (
      <div className={styles.wrapper}>
        <textarea
          ref="textarea"
          className={styles.textarea}
          onChange={handleChange}
        />
      </div>
    );
  }
  componentDidMount() {
    const textarea = this.refs.textarea as HTMLTextAreaElement;

    textarea.value = this.props.project.script;
  }
}

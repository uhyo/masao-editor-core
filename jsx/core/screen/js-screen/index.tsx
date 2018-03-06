import * as React from 'react';
import { EditState, ProjectState } from '../../../../stores';
import * as editActions from '../../../../actions/edit';

import JSWarning from './js-warning';
import JSEdit from './js-edit';

export interface IPropJsScreen {
  jsWarning: boolean;
  edit: EditState;
  project: ProjectState;
}
/**
 * Screen of jS extension.
 */
export const JsScreen = ({ jsWarning, edit, project }: IPropJsScreen) => {
  if (jsWarning && !edit.js_confirm) {
    const handleConfirm = () => {
      editActions.jsConfirm({
        confirm: true,
      });
    };
    return (
      <div>
        <JSWarning onClick={handleConfirm} />
      </div>
    );
  } else {
    return (
      <div>
        <JSEdit project={project} />
      </div>
    );
  }
};

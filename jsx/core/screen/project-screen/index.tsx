import * as React from 'react';
import { EditState, MapState, ProjectState } from '../../../../stores';

import ProjectEdit from './project-edit';

export interface IPropProjectScreen {
  project: ProjectState;
  map: MapState;
  edit: EditState;
}
/**
 * Screen of project setting.
 */
export const ProjectScreen = (props: IPropProjectScreen) => {
  return (
    <div>
      <ProjectEdit {...props} />
    </div>
  );
};

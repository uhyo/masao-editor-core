import * as React from 'react';

import { EditState, ParamsState, ProjectState } from '../../../../stores';
import ParamEdit from './param-edit';

export interface IPropParamScreen {
  edit: EditState;
  params: ParamsState;
  project: ProjectState;
}
/**
 * Screen of param edit.
 */
export const ParamScreen = (props: IPropParamScreen) => {
  const { edit, params, project } = props;
  return <ParamEdit params={params} edit={edit} project={project} />;
};

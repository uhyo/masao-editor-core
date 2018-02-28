import * as React from 'react';

import * as editActions from '../../actions/edit';
import { EditState } from '../../stores/edit';

import Select from './util/select';

export interface IPropScreenSelect {
  edit: EditState;
}
export default class ScreenSelect extends React.Component<
  IPropScreenSelect,
  {}
> {
  render() {
    const edit = this.props.edit;
    const contents = [
      {
        key: 'map',
        label: 'マップ編集',
      },
      {
        key: 'layer',
        label: '背景レイヤー編集',
      },
      {
        key: 'params',
        label: 'param編集',
      },
      {
        key: 'project',
        label: 'プロジェクト設定',
      },
      {
        key: 'js',
        label: '拡張JS',
      },
    ];
    const onScreenChange = (
      key: 'map' | 'layer' | 'params' | 'project' | 'js',
    ) => {
      editActions.changeScreen({
        screen: key,
      });
    };
    return (
      <div>
        <Select
          contents={contents}
          value={edit.screen}
          onChange={onScreenChange}
        />
      </div>
    );
  }
}

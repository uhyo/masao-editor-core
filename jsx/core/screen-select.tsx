import * as React from 'react';

import * as editActions from '../../actions/edit';
import { EditState } from '../../stores/edit';

import Select from './util/select';
import memoizeOne from 'memoize-one';
import { MapState } from '../../stores';

type Screen = editActions.Screen;

export interface IPropScreenSelect {
  edit: EditState;
  map: MapState;
}
export default class ScreenSelect extends React.Component<
  IPropScreenSelect,
  {}
> {
  render() {
    const { edit, map } = this.props;
    const contents = getScreenList(map.advanced);
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

/**
 * Get list of screens.
 */
const getScreenList = memoizeOne(
  (
    advanced: boolean,
  ): Array<{
    key: Screen;
    label: string;
  }> => {
    const result: Array<{
      key: Screen;
      label: string;
    }> = [
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
    if (advanced) {
      // advanced mapを使用中の場合はカスタムパーツエディタを追加
      result.splice(4, 0, {
        key: 'custom-parts',
        label: 'カスタムパーツ',
      });
    }
    return result;
  },
);

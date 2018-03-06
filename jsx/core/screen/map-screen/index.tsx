import * as React from 'react';

import {
  EditState,
  HistoryState,
  MapState,
  ParamsState,
  ProjectState,
} from '../../../../stores';

import MapEdit from './map-edit';
import ChipSelect from './chip-select';
import EditMode from './edit-mode';
import MiniMap from './mini-map';
import KeyEvent from './key-event';

import * as styles from '../../css/screen/map-screen.css';

import { Toolbar } from '../../util/toolbar';

export interface IPropMapScreen {
  // 画像
  pattern: string;
  mapchip: string;
  chips: string;

  'fit-y'?: boolean;
  /**
   * Whether key input is disabled.
   */
  keyDisabled: boolean;

  edit: EditState;
  params: ParamsState;
  map: MapState;
  project: ProjectState;
  history: HistoryState;
}
/**
 * Screen of map edit.
 */
export const MapScreen = (props: IPropMapScreen) => {
  const {
    map,
    params,
    edit,
    project,
    history,

    pattern,
    mapchip,
    chips,
    'fit-y': fity,
    keyDisabled,
  } = props;
  let are = null;
  if (project.version === '2.8' && edit.screen === 'layer') {
    are = (
      <p>
        バージョン設定が2.8になっています。このバージョンでは背景レイヤーは使用できません。
      </p>
    );
  }

  const { lastUpdate, data, advanced } = map;
  // いまのステージ
  const stage = data[edit.stage - 1];

  // ステージが縦長か否かでミニマップの表示位置を変更
  const mapsClass =
    stage.size.x >= stage.size.y ? styles.mapsColumn : styles.mapsRow;

  return (
    <>
      <Toolbar>
        <div className={styles.mapInfo}>
          <EditMode edit={edit} params={params} history={history} />
        </div>
      </Toolbar>
      {are}
      <div className={mapsClass}>
        <div className={styles.minimapWrapper}>
          <MiniMap params={params} edit={edit} stage={stage} />
        </div>
        <div className={styles.cmWrapper}>
          <div className={styles.chipselectWrapper}>
            <ChipSelect
              pattern={pattern}
              mapchip={mapchip}
              chips={chips}
              params={params}
              edit={edit}
              project={project}
              advanced={advanced}
            />
          </div>
          <div className={styles.mainmapWrapper}>
            <MapEdit
              pattern={pattern}
              mapchip={mapchip}
              chips={chips}
              stage={stage}
              lastUpdate={lastUpdate}
              params={params}
              edit={edit}
              project={project}
              fit-y={fity}
            />
          </div>
        </div>
      </div>
      <KeyEvent disabled={keyDisabled} />
    </>
  );
};

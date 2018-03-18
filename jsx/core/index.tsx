import * as React from 'react';
import { autorun, IReactionDisposer } from 'mobx';

import { RefluxComponent } from '../../scripts/reflux-util';

import * as masao from '../../scripts/masao';

export type MasaoJSONFormat = masao.format.MasaoJSONFormat;

import * as editActions from '../../actions/edit';
import * as paramActions from '../../actions/params';
import * as projectActions from '../../actions/project';
import * as mapActions from '../../actions/map';
import * as keyActions from '../../actions/key';
import * as mapLogics from '../../logics/map';
import { getCurrentGame } from '../../logics/game';
import { Command, ExternalCommand } from '../../logics/command';

import mapStore, { MapState, MapStore } from '../../stores/map';
import paramStore, { ParamsState, ParamsStore } from '../../stores/params';
import editStore, { EditState, EditStore } from '../../stores/edit';
import projectStore, { ProjectState } from '../../stores/project';
import historyStore, { HistoryState } from '../../stores/history';
import keyStore from '../../stores/key';
import commandStore from '../../stores/command';
import updateStore from '../../stores/update';

import ScreenSelect from './screen-select';
import { MapScreen } from './screen/map-screen';
import { ParamScreen } from './screen/param-screen';
import { ProjectScreen } from './screen/project-screen';
import { JsScreen } from './screen/js-screen';

import Button from './util/button';
import { Toolbar } from './util/toolbar';

import './css/init.css';
import './theme/color.css';
import * as styles from './css/index.css';

export interface IDefnMasaoEditorCore {
  map: MapState;
  params: ParamsState;
  edit: EditState;
  project: ProjectState;
  history: HistoryState;
}
export interface IPropMasaoEditorCore {
  /**
   * Whether show a warning when editing a JS.
   */
  jsWarning?: boolean;
  /**
   * An id of back up.
   */
  backupId?: string;
  /**
   * Filename of pattern image.
   */
  filename_pattern: string;
  /**
   * Filename of mapchip image.
   */
  filename_mapchip: string;

  /**
   * Default param data.
   */
  defaultParams?: Record<string, string>;

  // TODO
  defaultGame?: MasaoJSONFormat;
  /**
   * @deprecated
   * External commands is legacy!
   */
  externalCommands?: Array<{
    label: string;
    request(game: MasaoJSONFormat, states: IDefnMasaoEditorCore): void;
  }>;

  /**
   * Additional classes.
   */
  className?: string;
  /**
   * Whether the editor should fit the y-axis of container.
   */
  'fit-y'?: boolean;
  /**
   * Whether keyboard is disabled.
   */
  keyDisabled?: boolean;
  /**
   * External status of updates flag.
   */
  updateFlag?: boolean;

  /**
   * Handler of external commands.
   */
  onCommand?: (command: ExternalCommand) => void;
  /**
   * Handler of any updates to the stage.
   */
  onUpdateFlag?: (updated: boolean) => void;
}
export interface IStateMasaoEditorCore {}
export default class MasaoEditorCore extends RefluxComponent<
  IDefnMasaoEditorCore,
  IPropMasaoEditorCore,
  IStateMasaoEditorCore
> {
  private autosaveTimer: any = null;
  private backupField = 'masao-editor-backup';
  private backupInterval = 60000;
  /**
   * Disposer of external command autorun.
   */
  protected autorunDisposers: IReactionDisposer[] = [];
  constructor(props: IPropMasaoEditorCore) {
    super(
      props,
      {
        map: mapStore,
        params: paramStore,
        edit: editStore,
        project: projectStore,
        history: historyStore,
      },
      {},
    );

    // backupがあるか?
    const { backupId } = this.props;
    let g: MasaoJSONFormat | undefined = void 0;
    if ('undefined' !== typeof localStorage && backupId != null) {
      const b = localStorage.getItem(this.backupFieldName(backupId));
      if (b) {
        try {
          g = JSON.parse(b);
        } catch (e) {
          g = void 0;
        }
      }
    }
    if (g == null) {
      //default
      g = this.props.defaultGame;
    }
    if (g != null) {
      this.loadGame(g);
    }
    if (props.updateFlag != null) {
      if (props.updateFlag) {
        updateStore.update();
      } else {
        updateStore.reset();
      }
    }
  }
  componentDidMount() {
    const { backupId } = this.props;
    if (backupId != null) {
      this.autosaveTimer = setInterval(() => {
        this.backup();
      }, this.backupInterval);
      this.backup();
    }

    // start an autorun for external command.
    this.autorunDisposers = [
      autorun(this.handleExternalCommand.bind(this)),
      autorun(this.handleUpdateFlag.bind(this)),
    ];

    super.componentDidMount();
  }
  comoponentWillUnmount() {
    if (this.autosaveTimer != null) {
      clearInterval(this.autosaveTimer);
      this.clearBackup();
    }
    for (const f of this.autorunDisposers) {
      f();
    }
    super.componentWillUnmount();
  }
  componentWillReceiveProps(newProps: IPropMasaoEditorCore) {
    if (
      this.props.defaultGame !== newProps.defaultGame &&
      newProps.defaultGame != null
    ) {
      this.loadGame(newProps.defaultGame);
    } else if (
      newProps.defaultGame &&
      this.props.defaultParams !== newProps.defaultParams &&
      newProps.defaultParams != null
    ) {
      paramActions.resetParams(newProps.defaultParams);
      mapLogics.loadParamMap(newProps.defaultParams);
      projectActions.changeVersion({
        version: masao.acceptVersion(newProps.defaultGame.version),
      });
    }
  }
  public componentDidUpdate() {
    const { updateFlag } = this.props;
    if (updateFlag != null) {
      if (updateFlag) {
        updateStore.update();
      } else {
        updateStore.reset();
      }
    }
  }
  private loadGame(game: masao.format.MasaoJSONFormat) {
    const version = masao.acceptVersion(game.version);
    const params = masao.param.addDefaults(game.params, version);
    const script = game.script || '';

    const advanced = game['advanced-map'] != null;

    mapActions.setAdvanced({
      advanced,
    });
    paramActions.resetParams(params);
    projectActions.changeVersion({ version });

    projectActions.changeScript({
      script,
    });
    editActions.jsConfirm({
      confirm: !!script,
    });

    if (advanced) {
      const a = game['advanced-map']!;
      mapLogics.loadAdvancedMap(
        a.stages.map((stage: any) => {
          let map;
          let layer;
          for (let obj of stage.layers) {
            if (obj.type === 'main') {
              map = obj.map;
            } else if (obj.type === 'mapchip') {
              layer = obj.map;
            }
          }
          return {
            size: stage.size,
            map,
            layer,
          };
        }),
      );
    } else {
      mapLogics.loadParamMap(params);
    }
  }
  render() {
    const {
      props: {
        filename_pattern,
        filename_mapchip,
        jsWarning,
        externalCommands,
        'fit-y': fity,
        keyDisabled,
      },
      state: { map, params, edit, project, history },
    } = this;
    const chips: string = require('../../images/chips.png');

    let screen = null;
    if (edit.screen === 'map' || edit.screen === 'layer') {
      screen = (
        <MapScreen
          pattern={filename_pattern}
          mapchip={filename_mapchip}
          chips={chips}
          map={map}
          params={params}
          edit={edit}
          project={project}
          history={history}
          fit-y={fity}
          keyDisabled={!!keyDisabled}
        />
      );
    } else if (edit.screen === 'params') {
      screen = <ParamScreen params={params} edit={edit} project={project} />;
    } else if (edit.screen === 'project') {
      screen = <ProjectScreen project={project} map={map} edit={edit} />;
    } else if (edit.screen === 'js') {
      screen = (
        <JsScreen jsWarning={!!jsWarning} edit={edit} project={project} />
      );
    }
    let external_buttons = null;
    if (externalCommands != null) {
      external_buttons = externalCommands.map(com => {
        return (
          <div key={com.label}>
            <Button
              label={com.label}
              onClick={this.handleExternal(com.request)}
            />
          </div>
        );
      });
    }
    return (
      <div
        className={
          styles.wrapper +
          (this.props.className ? ' ' + this.props.className : '')
        }
      >
        <Toolbar>
          <div className={styles.info}>
            <div>
              <div className={styles.toolboxLabel}>画面選択</div>
              <ScreenSelect edit={edit} />
            </div>
            {external_buttons}
          </div>
        </Toolbar>
        <div className={fity ? styles.screenWrapperFit : undefined}>
          {screen}
        </div>
      </div>
    );
  }
  protected handleExternal(
    req: (game: MasaoJSONFormat, obj: IDefnMasaoEditorCore) => void,
  ) {
    //paramにmapの内容を突っ込む
    return () => {
      const { map, project, edit, params, history } = this.state;

      req(this.getCurrentGame(), {
        map,
        project,
        edit,
        params,
        history,
      });
    };
  }
  protected backupFieldName(backupId: string) {
    const { backupField } = this;
    return `${backupField}:${backupId}`;
  }
  /**
   * バックアップを保存
   */
  protected backup() {
    const { backupId } = this.props;
    if (backupId != null) {
      const game = this.getCurrentGame();
      localStorage.setItem(
        this.backupFieldName(backupId),
        JSON.stringify(game),
      );
    }
  }
  /**
   * バックアップを削除
   */
  protected clearBackup() {
    const { backupId } = this.props;
    if (backupId != null) {
      localStorage.removeItem(this.backupFieldName(backupId));
    }
  }

  // get infooooooom API
  public getCurrentGame(): MasaoJSONFormat {
    const obj = getCurrentGame();
    return obj;
  }
  public getCurrentStage(): number {
    return this.state.edit.stage;
  }
  public getKeyConfig(): Record<string, Command> {
    return keyStore.state.binding;
  }
  public setKeyConfig(binding: Record<string, Command>) {
    keyActions.setKeyBinding({
      binding,
    });
  }
  /**
   * Handle an update of external command.
   */
  protected handleExternalCommand(): void {
    const { command } = commandStore;
    const { onCommand } = this.props;
    if (command != null && onCommand) {
      onCommand(command);
    }
  }
  /**
   * Handle update signal from the update store.
   */
  protected handleUpdateFlag(): void {
    const { updated } = updateStore;
    const { onUpdateFlag } = this.props;
    if (onUpdateFlag != null) {
      onUpdateFlag(updated);
    }
  }

  //export stores
  static mapStore: MapStore = mapStore;
  static paramStore: ParamsStore = paramStore;
  static editStore: EditStore = editStore;
}

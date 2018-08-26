/*
 * Load game from MasaoJSONFormat.
 */
import * as masao from '../../scripts/masao';
import * as editActions from '../../actions/edit';
import * as mapActions from '../../actions/map';
import * as mapLogics from '../map';
import * as paramActions from '../../actions/params';
import * as projectActions from '../../actions/project';
import * as customPartsActions from '../../actions/custom-parts';
import { CustomPartsData } from '../../defs/map';

type MasaoJSONFormat = masao.format.MasaoJSONFormat;
type AdvancedMap = masao.format.AdvancedMap;
type MJSExtFields = masao.MJSExtFields;

/**
 * Load masao-json-format game into editor.
 */
export function loadGame(
  editorExtField: string | undefined,
  game: MasaoJSONFormat,
) {
  const version = masao.acceptVersion(game.version);
  const params = masao.param.addDefaults(game.params, version);
  const script = game.script || '';
  const editorExt: MJSExtFields =
    (game as any)[
      editorExtField != null ? editorExtField : masao.extFieldDefault
    ] || {};

  /**
   * Flag of whether advanced-map is used.
   */
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
    const customParts = loadCustomParts(a.customParts, editorExt);
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
      customParts,
    );
  } else {
    mapLogics.loadParamMap(params);
    // カスタムパーツは無しにする
    customPartsActions.loadCustomParts({
      customParts: {},
    });
  }
  //最後にスクリーンを変更
  editActions.changeScreen({
    screen: 'map',
  });
}

/**
 * Load custom parts definition from masao-json-format data
 * and add extensions to it.
 */
function loadCustomParts(
  customParts: AdvancedMap['customParts'],
  ext: MJSExtFields,
): CustomPartsData {
  if (customParts == null) {
    // convert to empty data.
    return {};
  }
  const customPartsExt = ext.customParts || {};
  const result: CustomPartsData = {};
  for (const key in customParts) {
    const name =
      customPartsExt[key] != null ? customPartsExt[key].name || key : key;
    result[key] = {
      name,
      ...customParts[key],
    };
  }
  return result;
}

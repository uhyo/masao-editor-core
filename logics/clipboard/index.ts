import { getCopiedMapData } from './map-data';
import { fragmentToText, fragmentFromText } from './text-data';
import { checkFragmentJSONFormat } from './fragment';
import { putFragmentAsFloating } from './paste';
import editStore from '../../stores/edit';
import { mapUpdateRectAction } from '../edit/tool';
import { setFloating, setTool } from '../../actions/edit';

/**
 * Logic of copying/cutting.
 * @returns {boolean} whether something is copied into clipboard.
 */
export function copyMapData(
  clipboardData: DataTransfer,
  isCut: boolean,
): boolean {
  // TODO
  const obj = getCopiedMapData();
  if (obj != null) {
    const [fragment, rect] = obj;
    const mapText = fragmentToText(fragment);
    clipboardData.setData('application/json', JSON.stringify(fragment));
    clipboardData.setData('text/plain', mapText);
    if (isCut) {
      // カットの場合は元のマップから消す
      const { screen, stage } = editStore.state;
      mapUpdateRectAction(screen)({
        stage,
        chip: 0,
        ...rect,
      });
      setTool({
        tool: null,
      });
      setFloating({
        floating: null,
      });
    }
    return true;
  }
  return false;
}

/**
 * Logic of pasting.
 * @returns whether something is pasted.
 */
export function pasteMapData(clipboardData: DataTransfer): boolean {
  const { screen } = editStore.state;
  if (screen !== 'map' && screen !== 'layer') {
    return false;
  }
  try {
    const json = JSON.parse(clipboardData.getData('application/json'));
    if (checkFragmentJSONFormat(json)) {
      return putFragmentAsFloating(json);
    }
  } catch {}
  // テキストをフラグメントとして解釈
  const text = clipboardData.getData('text/plain');
  const fragment = fragmentFromText(screen, text);
  if (fragment == null) {
    return false;
  }
  return putFragmentAsFloating(fragment);
}

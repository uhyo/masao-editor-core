// command
import editStore from '../../stores/edit';
import { runMapCommand } from './map-screen';
import { Command, ExternalCommand, commandNames } from './def';
import { runExternalCommand } from './external';

export { Command, ExternalCommand, commandNames };

/**
 * コマンドを実行
 * @returns 有効なコマンドが実行されたか
 */
export function run(command: Command, keydown: boolean): boolean {
  if (keydown) {
    // external系コマンドを先に処理
    if (runExternalCommand(command)) {
      return true;
    }
  }
  const { screen } = editStore.state;
  if (screen !== 'map' && screen !== 'layer') {
    // 今のところマップ画面のみ
    return false;
  }
  return runMapCommand(command, keydown);
}

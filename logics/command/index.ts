// command
import editStore from '../../stores/edit';
import commandStore from '../../stores/command';
import { getCurrentGame } from '../game';
import { runMapCommand } from './map-screen';
import { Command, ExternalCommand, commandNames } from './def';

export { Command, ExternalCommand, commandNames };

/**
 * コマンドを実行
 * @returns 有効なコマンドが実行されたか
 */
export function run(command: Command, keydown: boolean): boolean {
  if (keydown) {
    // external系コマンドを先に処理
    switch (command) {
      case 'external:save': {
        commandStore.invokeCommand({
          type: 'save',
          kind: 'default',
        });
        return true;
      }
      case 'external:json': {
        commandStore.invokeCommand({
          type: 'save',
          kind: 'json',
        });
        return true;
      }
      case 'external:html': {
        commandStore.invokeCommand({
          type: 'save',
          kind: 'html',
        });
        return true;
      }
      case 'external:open': {
        commandStore.invokeCommand({
          type: 'open',
        });
        return true;
      }
      case 'external:testplay': {
        // テストプレイを要求
        const game = getCurrentGame();
        const { stage } = editStore.state;
        commandStore.invokeCommand({
          type: 'testplay',
          game,
          stage,
        });
        return true;
      }
    }
  }
  const { screen } = editStore.state;
  if (screen !== 'map' && screen !== 'layer') {
    // 今のところマップ画面のみ
    return false;
  }
  return runMapCommand(command, keydown);
}

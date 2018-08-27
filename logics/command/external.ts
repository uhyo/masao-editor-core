import editStore from '../../stores/edit';
import commandStore from '../../stores/command';
import { getCurrentGame } from '../game';
export function runExternalCommand(command: string): boolean {
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
  return false;
}

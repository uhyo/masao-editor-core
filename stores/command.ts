import { action, extendObservable } from 'mobx';

import { ExternalCommand } from '../logics/command';

/**
 * House of external commands.
 * XXX is this really a "store"?
 */
export class CommandStore {
  public command!: ExternalCommand | null;
  constructor() {
    extendObservable(
      this,
      {
        command: null,
      },
      undefined,
      {
        deep: false,
      },
    );
    this.invokeCommand = action(this.invokeCommand.bind(this));
  }
  /**
   * Invoke an external command.
   */
  public invokeCommand(command: ExternalCommand) {
    this.command = command;
  }
}

export default new CommandStore();

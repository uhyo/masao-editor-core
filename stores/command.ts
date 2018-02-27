import {
    action,
    extendShallowObservable,
} from 'mobx';

import {
    ExternalCommand,
} from '../logics/command';

/**
 * House of external commands.
 * XXX is this really a "store"?
 */
export class CommandStore {
    public command: ExternalCommand | null = null;
    constructor() {
        extendShallowObservable(this, {
            command: null,
        });
        this.invokeCommand = action.bound(this.invokeCommand);
    }
    /**
     * Invoke an external command.
     */
    public invokeCommand(command: ExternalCommand) {
        this.command = command;
    }
}

export default new CommandStore();

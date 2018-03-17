import { action, extendObservable } from 'mobx';

/**
 * Handles update of stage.
 */
export class UpdateStore {
  /**
   * Whether it is updated.
   */
  public updated!: boolean;
  constructor() {
    extendObservable(this, {
      updated: false,
    });
    this.update = action(this.update.bind(this));
    this.reset = action(this.reset.bind(this));
  }
  /**
   * update the state.
   */
  public update(): void {
    this.updated = true;
  }
  /**
   * reset the updated state.
   */
  public reset(): void {
    this.updated = false;
  }
}

export default new UpdateStore();

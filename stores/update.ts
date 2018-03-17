import { action, extendObservable } from 'mobx';

/**
 * Handles update of stage.
 */
export class UpdateStore {
  /**
   * Whether it is updated.
   */
  public updated: boolean = false;
  constructor() {
    extendObservable(this, {
      updated: false,
    });
    this.update = action.bound(this.update);
    this.reset = action.bound(this.reset);
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

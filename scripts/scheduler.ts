import {
  requestIdleCallback,
  cancelIdleCallback,
  RequestIdleCallbackDeadline,
  RequestIdleCallbackHandle,
} from '../scripts/requestidlecallback';
export type Task = () => void;
/**
 * Simple scheduler using requestIdleCallback.
 */
export class IdleScheduler {
  private tasks: IterableIterator<Task>;
  private currentId: RequestIdleCallbackHandle | null = null;
  private promiseResolver: (result: boolean) => void = () => {};
  constructor(taskGenerator: () => IterableIterator<Task>) {
    this.tasks = taskGenerator();
  }
  /**
   * Start running the tasks.
   * Returns a Promise which resolves to a boolean of whether the tasks were completed.
   */
  public run(): Promise<boolean> {
    return new Promise(resolve => {
      this.promiseResolver = resolve;
      const runTask = (deadline: RequestIdleCallbackDeadline) => {
        this.currentId = null;
        while (deadline.timeRemaining() > 0) {
          const nextTask = this.tasks.next();
          if (nextTask.done) {
            // no task is pending.
            this.promiseResolver(true);
            return;
          }
          // do one task.
          nextTask.value();
        }
        // request next track.
        this.currentId = requestIdleCallback(runTask);
      };
      this.currentId = requestIdleCallback(runTask);
    });
  }
  /**
   * Terminate this scheduler.
   */
  public terminate(): void {
    if (this.currentId != null) {
      // Task was not complete.
      cancelIdleCallback(this.currentId);
      this.promiseResolver(false);
    }
    if (this.tasks.return != null) {
      this.tasks.return();
    }
  }
}

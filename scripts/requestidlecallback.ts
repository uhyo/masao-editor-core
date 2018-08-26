// Just interface because TS currently does not have requestIdleCallback.

// https://github.com/Microsoft/TypeScript/issues/21309#issuecomment-376338415
export type RequestIdleCallbackHandle = any;
export type RequestIdleCallbackOptions = {
  timeout: number;
};
export type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

export const requestIdleCallback: ((
  callback: ((deadline: RequestIdleCallbackDeadline) => void),
  opts?: RequestIdleCallbackOptions,
) => RequestIdleCallbackHandle) = (window as any).requestIdleCallback;
export const cancelIdleCallback: ((
  handle: RequestIdleCallbackHandle,
) => void) = (window as any).cancelIdleCallback;

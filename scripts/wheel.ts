// handle Wheel Event
export interface WheelDelta {
  x: number;
  y: number;
}
export interface SubWheelEvent {
  ctrlKey: boolean;
  deltaX: number;
  deltaY: number;
  deltaMode: number /*0 | 1 | 2 */;
}

export function getDelta(
  { ctrlKey, deltaX, deltaY, deltaMode }: SubWheelEvent,
  pixelunit: number = 32,
): WheelDelta {
  const unit = ctrlKey ? 5 : 1;
  // けっこう適当な管理
  if (deltaMode >= 1) {
    return {
      x: deltaX > 0 ? unit : deltaX < 0 ? -unit : 0,
      y: deltaY > 0 ? unit : deltaY < 0 ? -unit : 0,
    };
  } else {
    return {
      x:
        deltaX > 0
          ? unit * Math.max(1, Math.floor(deltaX / pixelunit))
          : deltaX < 0 ? unit * Math.min(-1, Math.ceil(deltaX / pixelunit)) : 0,
      y:
        deltaY > 0
          ? unit * Math.max(1, Math.floor(deltaY / pixelunit))
          : deltaY < 0 ? unit * Math.min(-1, Math.ceil(deltaY / pixelunit)) : 0,
    };
  }
}

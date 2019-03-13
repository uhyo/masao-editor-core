import { EditState } from '../../../../../stores';
import * as React from 'react';
import * as styles from './index.css';

export interface IPropGridCanvas {
  edit: EditState;
  onContextMenu: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

/**
 * Draw a grid.
 */
export const GridCanvas: React.FunctionComponent<IPropGridCanvas> = ({
  edit,
  onContextMenu,
}) => {
  const { view_width, view_height, grid, pointer } = edit;
  const width = view_width * 32;
  const height = view_height * 32;

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasStyle = {
    opacity: grid ? 1 : 0,
    cursor: pointer || undefined,
  };
  useDrawGrid(canvasRef, edit);

  return (
    <canvas
      ref={canvasRef}
      className={styles.overlapCanvas}
      style={canvasStyle}
      width={width}
      height={height}
      onContextMenu={onContextMenu}
    />
  );
};
function useDrawGrid(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  edit: EditState,
) {
  const {
    scroll_stick_right,
    scroll_stick_bottom,
    view_width,
    view_height,
    view_width_remainder,
    view_height_remainder,
  } = edit;
  React.useEffect(() => {
    // draw grid.
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    // 吸い付きによる補正
    const x_corr = scroll_stick_right ? -view_width_remainder : 0;
    const y_corr = scroll_stick_bottom ? -view_height_remainder : 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 0, 0, .25)';
    // y-grids
    for (let x = 1; x < view_width; x++) {
      ctx.beginPath();
      const dx = x * 32 + x_corr;
      ctx.moveTo(dx, 0);
      ctx.lineTo(dx, view_height * 32);
      ctx.stroke();
    }
    // x-grids
    for (let y = 1; y < view_height; y++) {
      ctx.beginPath();
      const dy = y * 32 + y_corr;
      ctx.moveTo(0, dy);
      ctx.lineTo(view_width * 32, dy);
      ctx.stroke();
    }
  }, [
    scroll_stick_right,
    scroll_stick_bottom,
    view_width,
    view_height,
    view_width_remainder,
    view_height_remainder,
  ]);
}

import * as React from 'react';
import { useBackLayer } from './useBackLayer';
import {
  StageData,
  ParamsState,
  CustomPartsState,
  EditState,
  LastUpdateData,
} from '../../../../../stores';
import { useDraw } from './draw';
import { IntoImages } from '../../../../components/load-images';
import { Images } from '../../../../../defs/images';

export interface IPropMapCanvas {
  /**
   * images used for the map.
   */
  images: IntoImages<Images> | null;
  /**
   * width of canvas.
   */
  width: number;
  /**
   * height of canvas.
   */
  height: number;
  /**
   * Information of stage.
   */
  stage: StageData;
  edit: EditState;
  params: ParamsState;
  customParts: CustomPartsState;
  lastUpdate: LastUpdateData;
  /**
   * Temporal: method to draw chip
   */
  drawChipOn: (
    type: 'map' | 'layer',
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) => void;
}

export const MapCanvas: React.FunctionComponent<IPropMapCanvas> = ({
  images,
  width,
  height,
  stage,
  edit,
  params,
  customParts,
  lastUpdate,
  drawChipOn,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const backLayers = useBackLayer(
    images,
    stage,
    edit,
    params,
    customParts,
    lastUpdate,
    drawChipOn,
  );
  useDraw(canvasRef, backLayers, stage, edit, params);
  return <canvas width={width} height={height} ref={canvasRef} />;
};

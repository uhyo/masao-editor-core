import { Images } from '../../../defs/images';
import { ChipRenderer } from '../chip-select/main';
import * as React from 'react';
import { IntoImages } from '../load-images';
import propChanged from '../../core/util/changed';
import { ChipCode } from '../../../scripts/chip';

export interface IPropChipDisplayMain {
  /**
   * Set of image urls.
   */
  images: IntoImages<Images>;
  /**
   * ID of chip.
   */
  chipId: ChipCode;
  /**
   * Renderer of chip.
   */
  onDrawChip: ChipRenderer<ChipCode>;
}

/**
 * Component which draws one chip on its canvas.
 */
export class ChipDisplayMain extends React.Component<IPropChipDisplayMain, {}> {
  /**
   * Ref to main canvas.
   */
  private canvasRef = React.createRef<HTMLCanvasElement>();
  public componentDidMount() {
    this.draw();
  }
  public componentDidUpdate(prevProps: IPropChipDisplayMain) {
    if (
      propChanged(prevProps, this.props, ['images', 'chipId', 'onDrawChip'])
    ) {
      this.draw();
    }
  }
  public render() {
    return <canvas ref={this.canvasRef} width="96" height="64" />;
  }
  private draw() {
    const canvas = this.canvasRef.current;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    const { onDrawChip, images, chipId } = this.props;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onDrawChip(ctx, images, 32, 0, chipId);
  }
}

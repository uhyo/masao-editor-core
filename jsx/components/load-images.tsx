import * as React from 'react';
import loadImage from '../../scripts/load-image';
import { ExtractKeyFor } from '../../defs/helper-types';

/**
 * Conversion of dictonary of image names to dictonary of img elements.
 */
export type IntoImages<T> = {
  [key in ExtractKeyFor<T, string>]: HTMLImageElement
};

export interface IPropLoadImages<T> {
  /**
   * List of images to load.
   */
  images: T;
  /**
   * Render children.
   */
  children: (loadImages: IntoImages<T> | null) => React.ReactNode;
}
export interface IStateLoadImages<T> {
  /**
   * Currently loaded images.
   */
  loadedImages: IntoImages<T> | null;
}

/**
 * Component to load images and use them inside.
 */
export class LoadImages<T extends {}> extends React.PureComponent<
  IPropLoadImages<T>,
  IStateLoadImages<T>
> {
  /**
   * anti-pattern but Promise cancellation is not easy...
   */
  private mounted: boolean = false;
  constructor(props: IPropLoadImages<T>) {
    super(props);
    this.state = {
      loadedImages: null,
    };
  }
  public componentDidMount() {
    // load images in parallel
    const { images } = this.props;
    this.mounted = true;
    // List of keys whose property has string field.
    const imagesKeys = Object.keys(images).filter(
      key => 'string' === typeof (images as any)[key],
    );
    const ps = imagesKeys.map(key => loadImage((images as any)[key] as string));
    Promise.all(ps)
      .then(imgs => {
        if (!this.mounted) {
          // If this component is already unmounted, do not update its state.
          return;
        }
        const loadedImages = {} as IntoImages<T>;
        imgs.forEach((img, i) => {
          loadedImages[imagesKeys[i]] = img;
        });
        this.setState({
          loadedImages,
        });
      })
      .catch(err => {
        // TODO: error handling
        console.error(err);
      });
  }
  public compoenntWillUnmount() {
    this.mounted = false;
  }
  public render() {
    return this.props.children(this.state.loadedImages);
  }
}

import * as React from 'react';
import loadImage from '../../../scripts/load-image';
import { IntoImages } from './into-images';

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
    this.loadImages(images);
  }
  public compoenntWillUnmount() {
    this.mounted = false;
  }
  public componentDidUpdate(prevProps: IPropLoadImages<T>) {
    if (prevProps.images !== this.props.images) {
      // Reload of images is required.
      this.loadImages(this.props.images);
    }
  }
  /**
   * Load images and asynchronously update loadedImags.
   */
  private loadImages(images: T) {
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
          // TODO: fix types
          (loadedImages as any)[imagesKeys[i]] = img;
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
  public render() {
    return this.props.children(this.state.loadedImages);
  }
}

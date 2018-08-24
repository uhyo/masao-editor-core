import * as React from 'react';
import { LoadImages } from './load-images';
import { IntoImages } from './into-images';

type WrappedProps<P extends object, K extends keyof P> = object &
  Pick<P, Exclude<keyof P, K>> &
  { [K2 in K]: IntoImages<P[K2]> };
/**
 * Convert component which takes image object into one which takes image urls.
 */
export function wrapLoadImages<P extends object, K extends keyof P>(
  key: K,
  Cls: React.ComponentType<P>,
): React.StatelessComponent<WrappedProps<P, K>> {
  return function({ [key]: images, ...props }: any) {
    return (
      <LoadImages images={images}>
        {images => {
          const newProps = {
            [key]: images,
            ...props,
          };
          return <Cls {...newProps} />;
        }}
      </LoadImages>
    );
  };
}

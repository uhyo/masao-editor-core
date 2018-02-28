'use strict';
//load image script
import Promise from './promise';

const loaded: Record<string, HTMLImageElement> = {};

//load
export default function(src: string): Promise<HTMLImageElement> {
  if (loaded[src]) {
    return Promise.resolve(loaded[src]);
  }
  return new Promise<HTMLImageElement>((fulfill, reject) => {
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('load', () => {
      loaded[src] = img;
      fulfill(img);
    });
    img.addEventListener('error', () => {
      reject('Failed to load ' + src);
    });
  });
}

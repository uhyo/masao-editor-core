import * as React from 'react';
import { copyMapData } from '../../../../logics/clipboard';

export interface IPropClipboardEvents {}

export const ClipboardEvents: React.FunctionComponent<
  IPropClipboardEvents
> = () => {
  React.useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      // TODO
      if (copyMapData(e.clipboardData)) {
        e.preventDefault();
      }
    };
    document.addEventListener('copy', onCopy);
    return () => document.removeEventListener('copy', onCopy);
  }, []);
  return <React.Fragment />;
};

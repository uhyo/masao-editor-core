import * as React from 'react';
import { copyMapData, pasteMapData } from '../../../../logics/clipboard';

export interface IPropClipboardEvents {}

export const ClipboardEvents: React.FunctionComponent<
  IPropClipboardEvents
> = () => {
  React.useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      if (copyMapData(e.clipboardData)) {
        e.preventDefault();
      }
    };
    const onPaste = (e: ClipboardEvent) => {
      if (pasteMapData(e.clipboardData)) {
        e.preventDefault();
      }
    };
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    return () => {
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
    };
  }, []);
  return <React.Fragment />;
};

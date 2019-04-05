import * as React from 'react';
import { copyMapData, pasteMapData } from '../../../../logics/clipboard';

export interface IPropClipboardEvents {}

export const ClipboardEvents: React.FunctionComponent<
  IPropClipboardEvents
> = () => {
  React.useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      if (copyMapData(e.clipboardData, false)) {
        e.preventDefault();
      }
    };
    const onPaste = (e: ClipboardEvent) => {
      if (pasteMapData(e.clipboardData)) {
        e.preventDefault();
      }
    };
    const onCut = (e: ClipboardEvent) => {
      if (copyMapData(e.clipboardData, true)) {
        e.preventDefault();
      }
    };
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('cut', onCut);
    return () => {
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('cut', onCut);
    };
  }, []);
  return <React.Fragment />;
};

import { useEffect, useCallback } from 'react';
import { useRefMemo } from '../../../../scripts/useRefMemo';

export interface DocumentMouseEvents {
  mouseMove?: boolean;
  mouseUp?: boolean;
  onMouseMove?(e: MouseEvent): void;
  onMouseUp?(e: MouseEvent): void;
}
/**
 * Register document-wide mouse events.
 */
export function useDocumentMouseEvents({
  mouseMove,
  mouseUp,
  onMouseMove,
  onMouseUp,
}: DocumentMouseEvents): void {
  // mouseUp is saved in memo.
  const mouseUpHandlerRef = useRefMemo<undefined | ((e: MouseEvent) => void)>(
    () => (mouseUp && onMouseUp != null ? onMouseUp : void 0),
    [mouseUp, onMouseUp],
  );
  // to catch fast click, always register mouseup handler.
  // (to reduce computing resource, mousemove handler is deferred.)
  const mouseUpHandler = useCallback(
    (e: MouseEvent) => {
      if (mouseUpHandlerRef.current != null) {
        mouseUpHandlerRef.current(e);
      }
    },
    [mouseUp, onMouseUp],
  );
  useEffect(() => {
    document.addEventListener('mouseup', mouseUpHandler, false);
    return () => document.removeEventListener('mouseup', mouseUpHandler, false);
  }, []);
  // register mousemove handler on demand.
  useEffect(() => {
    if (mouseMove && onMouseMove) {
      document.addEventListener('mousemove', onMouseMove, false);
    }
    return () => {
      if (mouseMove && onMouseMove) {
        document.removeEventListener('mousemove', onMouseMove, false);
      }
    };
  }, [mouseMove, onMouseMove]);
}

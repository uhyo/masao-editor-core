import { useEffect } from 'react';

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
  useEffect(() => {
    if (mouseMove && onMouseMove) {
      document.addEventListener('mousemove', onMouseMove, false);
    }
    if (mouseUp && onMouseUp) {
      document.addEventListener('mouseup', onMouseUp, false);
    }
    return () => {
      if (mouseMove && onMouseMove) {
        document.removeEventListener('mousemove', onMouseMove, false);
      }
      if (mouseUp && onMouseUp) {
        document.removeEventListener('mouseup', onMouseUp, false);
      }
    };
  }, [mouseMove, mouseUp, onMouseMove, onMouseUp]);
}

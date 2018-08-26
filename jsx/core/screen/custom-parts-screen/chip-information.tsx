import { ChipCode } from '../../../../scripts/chip';
import * as React from 'react';
import { ChipDisplay } from '../../../components/chip-display';
import { Images } from '../../../../defs/images';
import { ChipRenderer } from '../../../components/chip-select/main';

import * as styles from '../../css/screen/custom-parts-screen.css';
import { Chip } from '../../../../scripts/chip-data/interface';

export interface IPropChipInformation {
  images: Images;
  currentChipCode: ChipCode;
  chipDef: Chip;
  onDrawChip: ChipRenderer<ChipCode>;
}
/**
 * Show information of currently selected chip.
 */
export function ChipInformation({
  images,
  currentChipCode,
  chipDef,
  onDrawChip,
}: IPropChipInformation) {
  return (
    <div className={styles.chipInformation}>
      <div className={styles.chipDisplay}>
        <ChipDisplay
          chipId={currentChipCode}
          images={images}
          onDrawChip={onDrawChip}
        />
      </div>
      <div className={styles.chipDescription}>
        <p>{chipDef.name}</p>
        <p>ベース: {chipDef.nativeName}</p>
      </div>
    </div>
  );
}

import {
  CustomPartsState,
  EditState,
  ParamsState,
  MapState,
} from '../../../../stores';
import { ChipList } from '../../../components/chip-select';
import * as React from 'react';
import { drawChip, chipFor } from '../../../../scripts/chip';
import {
  stageBackColor,
  cssColor,
  complementColor,
} from '../../../../scripts/util';
import { Images } from '../../../../defs/images';
import { ScreenMainWrapper } from '../../../components/screen/screen-main';
import * as styles from '../../css/screen/custom-parts-screen.css';
import { ChipRenderer } from '../../../components/chip-select/main';

import * as editActions from '../../../../actions/edit';
import * as customPartsActions from '../../../../actions/custom-parts';
import * as customPartsLogics from '../../../../logics/custom-parts';
import { customPartsList } from '../../../../scripts/custom-parts';
import { CustomChipMain } from './main';
import { Toolbar, Toolbox } from '../../../components/toolbar';
import Button from '../../util/button';
import memoizeOne from 'memoize-one';
import { countChipInMap } from '../../../../logics/map';

export interface IPropCustomPartsScreen {
  images: Images;
  edit: EditState;
  map: MapState;
  params: ParamsState;
  customParts: CustomPartsState;
}

export class CustomPartsScreen extends React.Component<
  IPropCustomPartsScreen,
  {}
> {
  private countChipUsage: (chipCode: string) => number = memoizeOne(
    (chipCode: string) => countChipInMap(this.props.map, chipCode),
  );
  public render() {
    const { images, params, edit, map, customParts } = this.props;
    const { chipselect_width } = edit;
    const {
      customParts: customPartsData,
      currentChip,
      cursorPosition,
    } = customParts;
    const chips = customPartsList(customPartsData);
    // currentChipはindexなのでchipCodeを得る
    const currentChipCode = currentChip != null ? chips[currentChip] : null;
    // chip definition
    const chipDef =
      currentChipCode != null
        ? chipFor(params, customPartsData, currentChipCode)
        : null;

    const stageBackColorObject = stageBackColor(params, edit);
    const backgroundColor = cssColor(stageBackColorObject);
    const cursorColor = cssColor(complementColor(stageBackColorObject));

    // function to draw a chip.
    const drawChipCallback: ChipRenderer<number> = (
      ctx,
      images,
      x,
      y,
      chipIndex,
    ) => {
      const chips = customPartsList(customPartsData);
      drawChip(
        ctx,
        images,
        params,
        customPartsData,
        chips[chipIndex],
        x,
        y,
        false,
      );
    };
    // current properties.
    const currentData =
      currentChipCode != null ? customParts.customParts[currentChipCode] : null;
    // current count of usage of selected chip.
    const currentUseCount =
      currentChipCode != null ? this.countChipUsage(currentChipCode) : 0;
    // function to update selection of chip.
    const chipSelectCallback = (chipIndex: number) =>
      customPartsActions.setCurrentChip({ chipIndex });
    const newPartsCallback = () => {
      // 新規の場合は最初のデータを作る
      const cloneof = currentData || {
        extends: 5100,
        name: 'カスタムパーツ',
        properties: {},
        color: '#ffffff',
      };
      customPartsLogics.generateNewCustomParts(cloneof);
    };
    return (
      <ScreenMainWrapper className={styles.wrapper}>
        <ChipList
          images={images}
          chipNumber={chips.length}
          backgroundColor={backgroundColor}
          cursorColor={cursorColor}
          cursorPosition={cursorPosition}
          chipsWidth={chipselect_width}
          scrollY={0}
          onFocusChange={focus =>
            customPartsActions.setFocus({ focus: focus ? 'chipselect' : null })
          }
          onChipSelect={chipSelectCallback}
          onDrawChip={drawChipCallback}
          onResize={width => {
            editActions.changeChipselectSize({ width });
          }}
        />
        <div className={styles.main}>
          <Toolbar>
            <Toolbox label="カスタムパーツ編集">
              <Button onClick={newPartsCallback}>新規作成</Button>
            </Toolbox>
            {currentData != null && currentChipCode != null ? (
              <Toolbox label="選択中のパーツの操作">
                {currentUseCount > 0 ? (
                  /* 使われているので削除できない */
                  <Button
                    disabled
                    title="マップ内で使用されているパーツは削除できません。"
                  >
                    このパーツを削除
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      customPartsLogics.deleteCustomParts({
                        chipCode: currentChipCode,
                      })
                    }
                  >
                    このパーツを削除
                  </Button>
                )}
              </Toolbox>
            ) : null}
          </Toolbar>
          {currentChipCode == null || chipDef == null || currentData == null ? (
            chips.length === 0 ? (
              <p>まだカスタムパーツがありません。</p>
            ) : (
              <p>カスタムパーツを選択してください。</p>
            )
          ) : (
            <CustomChipMain
              images={images}
              map={map}
              params={params}
              customParts={customParts}
              currentChipCode={currentChipCode}
              currentData={currentData}
              currentUseCount={currentUseCount}
              chipDef={chipDef}
            />
          )}
        </div>
      </ScreenMainWrapper>
    );
  }
}

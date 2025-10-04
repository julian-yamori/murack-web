import React from "react";
import { useTrackSelection } from "./use_track_selection.ts";
import { SingleTrackForm } from "./SingleTrackForm.tsx";
import { LoadingView } from "../../common_components/LoadingView.tsx";

/**
 *  曲プロパティ (単曲) 画面
 */
export const SingleTrackPage: React.FC<
  {
    /** 前後ボタンで遷移可能な、全ての曲の ID */
    trackIds: ReadonlyArray<number>;

    /** 最初に表示する曲の、trackIds での位置 */
    defaultIndex: number;
  }
> = ({ trackIds, defaultIndex }) => {
  const {
    dbTrackProperty,
    currentIndex,
    moveToPrevTrack,
    moveToNextTrack,
  } = useTrackSelection({
    trackIds,
    defaultIndex,
  });

  if (dbTrackProperty === undefined) {
    return <LoadingView />;
  } else {
    return (
      <SingleTrackForm
        dbTrackProperty={dbTrackProperty}
        currentIndex={currentIndex}
        totalCount={trackIds.length}
        moveToPrevTrack={moveToPrevTrack}
        moveToNextTrack={moveToNextTrack}
      />
    );
  }
};

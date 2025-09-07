import React, { useEffect, useState } from "react";
import { useTrackSelection } from "../single/use_track_selection.ts";
import { Modal, Paper } from "@mui/material";
import { SingleTrackModalArgs } from "./use_single_track_modal.tsx";
import { SingleTrackForm } from "./SingleTrackForm.tsx";
import { LoadingView } from "../../common_components/LoadingView.tsx";

/**
 *  曲プロパティ (単曲) 画面の Modal
 */
export const SingleTrackModal: React.FC<
  { modalArgs: SingleTrackModalArgs | undefined }
> = ({ modalArgs }) => {
  /**
   * 1 曲でも保存が完了したフラグ
   *
   * Modal の親画面で情報を更新するのに使う
   */
  const [saved, setSaved] = useState(false);

  // Modal が閉じられたら saved フラグを下ろす
  useEffect(
    () => {
      if (modalArgs === undefined) {
        setSaved(false);
      }
    },
    [modalArgs],
  );

  const handleClose = () => {
    modalArgs?.close(saved);
  };

  const handleSaved = () => {
    setSaved(true);
  };

  return (
    <Modal open={modalArgs !== undefined} onClose={handleClose}>
      {modalArgs !== undefined
        ? (
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90vw",
              maxWidth: 800,
              height: "90vh",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SingleTrackDataLoader
              trackIds={modalArgs.trackIds}
              defaultIndex={modalArgs.defaultIndex}
              onClose={handleClose}
              onSaved={handleSaved}
            />
          </Paper>
        )
        : <React.Fragment />}
    </Modal>
  );
};

/** 単曲プロパティ画面の、データ読み込みとローディング表示の管理 */
const SingleTrackDataLoader: React.FC<
  {
    /** 前後ボタンで遷移可能な、全ての曲の ID */
    trackIds: ReadonlyArray<number>;

    /** 最初に表示する曲の、trackIds での位置 */
    defaultIndex: number;

    onClose: () => unknown;
    onSaved: () => unknown;
  }
> = (
  { trackIds, defaultIndex, onClose, onSaved },
) => {
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
        onClose={onClose}
        onSaved={onSaved}
      />
    );
  }
};

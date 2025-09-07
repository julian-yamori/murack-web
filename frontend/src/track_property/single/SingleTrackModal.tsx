import React, { useState } from "react";
import { useTrackSelection } from "../single/use_track_selection.ts";
import { Modal, Paper } from "@mui/material";
import { SingleTrackModalState } from "./use_single_track_modal.tsx";
import { SingleTrackForm } from "./SingleTrackForm.tsx";

/**
 *  曲プロパティ (単曲) 画面の Modal
 */
export const SingleTrackModal: React.FC<
  { modalState: SingleTrackModalState | undefined }
> = ({ modalState }) => {
  const handleCancel = () => {
    modalState?.close(false);
  };

  return (
    <Modal open={modalState !== undefined} onClose={handleCancel}>
      {modalState !== undefined
        ? <ModalView modalState={modalState} />
        : <React.Fragment />}
    </Modal>
  );
};

/** SingleTrackModal の表示本体 */
const ModalView: React.FC<{ modalState: SingleTrackModalState }> = (
  { modalState },
) => {
  const {
    dbTrackProperty,
    currentIndex,
    moveToPrevTrack,
    moveToNextTrack,
  } = useTrackSelection({
    trackIds: modalState.trackIds,
    defaultIndex: modalState.defaultIndex,
  });

  const [modified, setModified] = useState(false);

  const handleClose = () => {
    modalState.close(modified);
  };

  const handleSaved = () => {
    setModified(true);
  };

  if (!dbTrackProperty) {
    return (
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 2,
        }}
      >
        読み込み中...
      </Paper>
    );
  }

  return (
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
      <SingleTrackForm
        dbTrackProperty={dbTrackProperty}
        currentIndex={currentIndex}
        totalCount={modalState.trackIds.length}
        onMoveToPrev={moveToPrevTrack}
        onMoveToNext={moveToNextTrack}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    </Paper>
  );
};

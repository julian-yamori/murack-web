import React, { useMemo, useState } from "react";
import { SingleTrackProperty } from "../../gen/backend_api.ts";
import { useTrackSelection } from "../single/use_track_selection.ts";
import { Box, Button, Modal, Paper } from "@mui/material";
import { SingleTrackModalState } from "./use_single_track_modal.tsx";

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
  const [formState, setFormState] = useState<SingleTrackProperty>();

  const {
    dbTrackProperty,
    currentIndex,
    moveToPrevTrack,
    moveToNextTrack,
  } = useTrackSelection({
    trackIds: modalState.trackIds,
    defaultIndex: modalState.defaultIndex,
    setFormState,
  });

  // 仮で JSON を表示
  const dataJson = useMemo(
    () => JSON.stringify(formState, undefined, 2),
    [formState],
  );
  const _ = dbTrackProperty;

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "95%",
        width: 600,
        bgcolor: "background.paper",
        // border: "2px solid #000",
        // boxShadow: 24,
        p: 2,
      }}
    >
      <Box>
        <Button
          onClick={moveToPrevTrack}
          size="small"
          variant="outlined"
          disabled={currentIndex <= 0}
        >
          前の曲へ
        </Button>
        <Button
          onClick={moveToNextTrack}
          size="small"
          variant="outlined"
          disabled={currentIndex >= modalState.trackIds.length - 1}
        >
          次の曲へ
        </Button>
      </Box>
      <Box component="pre">{dataJson}</Box>
    </Paper>
  );
};

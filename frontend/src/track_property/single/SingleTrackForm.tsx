import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import {
  UnsavedChangesDialog,
  useUnsavedChangesDialog,
} from "../../common_components/UnsavedChangesDialog.tsx";
import {
  SingleTrackProperty,
  UpdateSingleTrackPropsRequest,
  useUpdateSingleTrackProps,
} from "../../gen/backend_api.ts";
import { isFormEdited } from "./formUtils.ts";
import { BasicInfoTab } from "./BasicInfoTab.tsx";
import { LyricsTab } from "./LyricsTab.tsx";
import { ArtworkTab } from "./ArtworkTab.tsx";
import { toast } from "react-toastify";
import {
  ScreenLockBackdrop,
  useScreenLock,
} from "../../common_components/screen_lock.tsx";

export const SingleTrackForm: React.FC<{
  dbTrackProperty: SingleTrackProperty;
  currentIndex: number;
  totalCount: number;
  moveToPrevTrack: () => unknown;
  moveToNextTrack: () => unknown;
  onSaved: (savedData: SingleTrackProperty) => unknown;
}> = ({
  dbTrackProperty,
  currentIndex,
  totalCount,
  moveToPrevTrack,
  moveToNextTrack,
  onSaved,
}) => {
  const { isLocked, lockScreen } = useScreenLock();

  const [currentTab, setCurrentTab] = useState(0);

  const {
    register,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm<SingleTrackProperty>({
    defaultValues: dbTrackProperty,
  });
  const formData = watch();

  // 編集状態の判定
  const isEdited = useMemo(
    () => isFormEdited(formData, dbTrackProperty),
    [formData, dbTrackProperty],
  );

  // 楽曲データ変更時にフォームをリセット
  useEffect(() => {
    reset(dbTrackProperty);
  }, [dbTrackProperty, reset]);

  // 保存API
  const updateMutation = useUpdateSingleTrackProps(dbTrackProperty.id);

  /** 保存ボタン押下時 */
  const handleSave = () => {
    return lockScreen(async () => {
      await updateMutation.trigger(formDataToUpdate(formData));
      toast.success("保存しました", { autoClose: 2000 });
      onSaved(formData);
    });
  };

  const {
    dialogArgs: unsavedDialogArgs,
    open: openUnsavedDialog,
  } = useUnsavedChangesDialog();

  // 保存確認付きの画面遷移実行
  const navigateWithSaveConfirm = (navigate: () => void) => {
    if (isEdited) {
      openUnsavedDialog({ doSave: handleSave, doNavigate: navigate });
    } else {
      navigate();
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ScreenLockBackdrop isLocked={isLocked} />

      {/* タブ */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="基本情報" />
          <Tab label="歌詞" />
          <Tab label="アートワーク" />
        </Tabs>
      </Box>

      {/* タブコンテンツ */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {currentTab === 0 && (
          <BasicInfoTab register={register} errors={errors} control={control} />
        )}
        {currentTab === 1 && <LyricsTab register={register} />}
        {currentTab === 2 && (
          <ArtworkTab artworks={dbTrackProperty.artworks || []} />
        )}
      </Box>

      {/* フッター */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            onClick={() => navigateWithSaveConfirm(moveToPrevTrack)}
            disabled={currentIndex <= 0}
            variant="outlined"
            size="small"
          >
            前の曲
          </Button>
          <Button
            onClick={() => navigateWithSaveConfirm(moveToNextTrack)}
            disabled={currentIndex >= totalCount - 1}
            variant="outlined"
            size="small"
          >
            次の曲
          </Button>
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} / {totalCount}
          </Typography>
        </Box>

        <Button
          onClick={handleSave}
          disabled={!isEdited}
          variant="contained"
        >
          保存
        </Button>
      </Box>

      {/* 保存確認ダイアログ */}
      <UnsavedChangesDialog dialogArgs={unsavedDialogArgs} />
    </Box>
  );
};

/** フォームの値を、サーバーへの保存リクエストの値に変換 */
function formDataToUpdate(
  formData: SingleTrackProperty,
): UpdateSingleTrackPropsRequest {
  const {
    title,
    artist,
    album_artist,
    album,
    genre,
    composer,
    track_number,
    track_max,
    disc_number,
    disc_max,
    release_date,
    rating,
    original_track,
    memo,
    memo_manage,
    suggest_target,
    lyrics,
    tags,
  } = formData;

  return {
    title,
    artist,
    album_artist,
    album,
    genre,
    composer,
    track_number,
    track_max,
    disc_number,
    disc_max,
    release_date,
    rating,
    original_track,
    memo,
    memo_manage,
    suggest_target,
    lyrics,
    tag_ids: tags.map((t) => t.id),
  };
}

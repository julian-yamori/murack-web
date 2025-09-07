import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  SingleTrackProperty,
  useUpdateSingleTrackProps,
} from "../../gen/backend_api.ts";
import { isFormEdited } from "./formUtils.ts";
import { BasicInfoTab } from "./BasicInfoTab.tsx";
import { LyricsTab } from "./LyricsTab.tsx";
import { ArtworkTab } from "./ArtworkTab.tsx";

export const SingleTrackForm: React.FC<{
  dbTrackProperty: SingleTrackProperty;
  currentIndex: number;
  totalCount: number;
  moveToPrevTrack: () => unknown;
  moveToNextTrack: () => unknown;

  /** ダイアログを閉じるボタンが押されたときに呼ばれる関数 */
  onClose: () => unknown;

  /** 曲情報がサーバーに保存されたときに呼ばれる関数 */
  onSaved: () => unknown;
}> = ({
  dbTrackProperty,
  currentIndex,
  totalCount,
  moveToPrevTrack,
  moveToNextTrack,
  onClose,
  onSaved,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [saveConfirmDialog, setSaveConfirmDialog] = useState<{
    open: boolean;
    action?: () => void;
  }>({ open: false });

  const {
    register,
    watch,
    reset,
    formState: { errors },
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

  const handleSave = async () => {
    await updateMutation.trigger({
      title: formData.title || "",
      artist: formData.artist || "",
      album_artist: formData.album_artist || "",
      album: formData.album || "",
      genre: formData.genre || "",
      composer: formData.composer || "",
      track_number: formData.track_number,
      track_max: formData.track_max,
      disc_number: formData.disc_number,
      disc_max: formData.disc_max,
      release_date: formData.release_date,
      rating: formData.rating || 0,
      original_track: formData.original_track || "",
      memo: formData.memo || "",
      memo_manage: formData.memo_manage || "",
      suggest_target: formData.suggest_target || false,
      lyrics: formData.lyrics || "",
      tag_ids: formData.tags?.map((t) => t.id) || [],
    });

    onSaved();
  };

  // 保存確認付きのアクション実行
  const executeWithSaveConfirm = (action: () => void) => {
    if (isEdited) {
      setSaveConfirmDialog({ open: true, action });
    } else {
      action();
    }
  };

  const handleSaveConfirmDialog = (choice: "save" | "discard" | "cancel") => {
    const { action } = saveConfirmDialog;
    setSaveConfirmDialog({ open: false });

    if (choice === "cancel") {
      return;
    }

    if (choice === "save" && action) {
      handleSave().then(() => action());
    } else if (choice === "discard" && action) {
      action();
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ヘッダー */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" gutterBottom>
          {dbTrackProperty.title || "（タイトルなし）"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dbTrackProperty.artist} • {currentIndex + 1} / {totalCount}
        </Typography>
      </Box>

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
          <BasicInfoTab register={register} errors={errors} />
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
        <Box>
          <Button
            onClick={() => executeWithSaveConfirm(moveToPrevTrack)}
            disabled={currentIndex <= 0}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          >
            前の曲
          </Button>
          <Button
            onClick={() => executeWithSaveConfirm(moveToNextTrack)}
            disabled={currentIndex >= totalCount - 1}
            variant="outlined"
            size="small"
          >
            次の曲
          </Button>
        </Box>

        <Box>
          <Button
            onClick={() => executeWithSaveConfirm(onClose)}
            sx={{ mr: 1 }}
          >
            閉じる
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isEdited || updateMutation.isMutating}
            variant="contained"
          >
            保存{isEdited ? " *" : ""}
          </Button>
        </Box>
      </Box>

      {/* 保存確認ダイアログ */}
      <Dialog
        open={saveConfirmDialog.open}
        onClose={() => handleSaveConfirmDialog("cancel")}
      >
        <DialogTitle>未保存の変更があります</DialogTitle>
        <DialogContent>
          <Typography>
            変更内容を保存しますか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSaveConfirmDialog("cancel")}>
            編集を続ける
          </Button>
          <Button onClick={() => handleSaveConfirmDialog("discard")}>
            保存しない
          </Button>
          <Button
            onClick={() => handleSaveConfirmDialog("save")}
            variant="contained"
          >
            保存する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

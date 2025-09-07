import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SingleTrackProperty } from "../../gen/backend_api.ts";

interface BasicInfoTabProps {
  register: UseFormRegister<SingleTrackProperty>;
  errors: FieldErrors<SingleTrackProperty>;
  control: Control<SingleTrackProperty>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  register,
  errors,
  control,
}) => {
  return (
    <Box>
      {/* 評価セクション（上部） */}
      <Box sx={{ mb: 3 }}>
        {/* レート */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            レート
          </Typography>
          <Controller
            name="rating"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <Rating
                {...field}
                value={field.value ?? 0}
                onChange={(_, value) => field.onChange(value ?? 0)}
                max={5}
                size="large"
              />
            )}
          />
        </Box>

        {/* タグ */}
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" size="small">
            タグを編集（未実装）
          </Button>
        </Box>

        {/* 原曲情報 */}
        <TextField
          {...register("original_track")}
          label="原曲情報"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          error={!!errors.original_track}
          helperText={errors.original_track?.message}
        />

        {/* アルバム推薦対象 */}
        <FormControlLabel
          control={
            <Checkbox
              {...register("suggest_target")}
            />
          }
          label="アルバム推薦対象"
          sx={{ mb: 2 }}
        />

        {/* 管理メモ */}
        <TextField
          {...register("memo_manage")}
          label="管理メモ"
          fullWidth
          multiline
          rows={3}
          size="small"
          sx={{ mb: 2 }}
          error={!!errors.memo_manage}
          helperText={errors.memo_manage?.message}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* 基本情報セクション（下部） */}
      <Stack spacing={2}>
        {/* タイトル */}
        <TextField
          {...register("title", { required: "タイトルは必須です" })}
          label="タイトル"
          fullWidth
          size="small"
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        {/* アーティスト・アルバムアーティスト */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            {...register("artist")}
            label="アーティスト"
            fullWidth
            size="small"
            error={!!errors.artist}
            helperText={errors.artist?.message}
          />
          <TextField
            {...register("album_artist")}
            label="アルバムアーティスト"
            fullWidth
            size="small"
            error={!!errors.album_artist}
            helperText={errors.album_artist?.message}
          />
        </Box>

        {/* アルバム・作曲者 */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            {...register("album")}
            label="アルバム"
            fullWidth
            size="small"
            error={!!errors.album}
            helperText={errors.album?.message}
          />
          <TextField
            {...register("composer")}
            label="作曲者"
            fullWidth
            size="small"
            error={!!errors.composer}
            helperText={errors.composer?.message}
          />
        </Box>

        {/* ジャンル */}
        <TextField
          {...register("genre")}
          label="ジャンル"
          fullWidth
          size="small"
          error={!!errors.genre}
          helperText={errors.genre?.message}
        />

        {/* トラック・ディスク番号 */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            {...register("track_number", {
              valueAsNumber: true,
              min: { value: 1, message: "1以上で入力してください" },
            })}
            label="トラック番号"
            type="number"
            size="small"
            error={!!errors.track_number}
            helperText={errors.track_number?.message}
          />
          <TextField
            {...register("track_max", {
              valueAsNumber: true,
              min: { value: 1, message: "1以上で入力してください" },
            })}
            label="トラック最大"
            type="number"
            size="small"
            error={!!errors.track_max}
            helperText={errors.track_max?.message}
          />
          <TextField
            {...register("disc_number", {
              valueAsNumber: true,
              min: { value: 1, message: "1以上で入力してください" },
            })}
            label="ディスク番号"
            type="number"
            size="small"
            error={!!errors.disc_number}
            helperText={errors.disc_number?.message}
          />
          <TextField
            {...register("disc_max", {
              valueAsNumber: true,
              min: { value: 1, message: "1以上で入力してください" },
            })}
            label="ディスク最大"
            type="number"
            size="small"
            error={!!errors.disc_max}
            helperText={errors.disc_max?.message}
          />
        </Box>

        {/* リリース日 */}
        <TextField
          {...register("release_date")}
          label="リリース日"
          type="date"
          size="small"
          sx={{ width: "300px" }}
          InputLabelProps={{ shrink: true }}
          error={!!errors.release_date}
          helperText={errors.release_date?.message}
        />

        {/* メモ */}
        <TextField
          {...register("memo")}
          label="メモ"
          fullWidth
          multiline
          rows={4}
          size="small"
          error={!!errors.memo}
          helperText={errors.memo?.message}
        />

        {/* 読み取り専用項目 */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          楽曲情報
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="再生時間"
            value={`${Math.floor((0) / 60)}:${
              String((0) % 60).padStart(2, "0")
            }`}
            size="small"
            sx={{ width: "150px" }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="ファイルパス"
            value=""
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Box>

        <TextField
          label="登録日"
          value=""
          size="small"
          sx={{ width: "250px" }}
          InputProps={{ readOnly: true }}
        />
      </Stack>
    </Box>
  );
};

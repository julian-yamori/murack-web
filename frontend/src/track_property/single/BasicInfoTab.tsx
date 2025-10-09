import React, { memo } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SingleTrackProperty } from "../../gen/backend_api.ts";
import { FormCheckbox } from "../../common_components/form/FormCheckbox.tsx";
import { FormRating } from "../../common_components/form/FormRating.tsx";

interface BasicInfoTabProps {
  register: UseFormRegister<SingleTrackProperty>;
  watch: UseFormWatch<SingleTrackProperty>;
  errors: FieldErrors<SingleTrackProperty>;
  control: Control<SingleTrackProperty>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = (
  { register, watch, errors, control },
) => {
  const { duration, created_at, path } = watch();

  return (
    <Box>
      {/* 評価セクション（上部） */}
      <EvaluationSection
        register={register}
        errors={errors}
        control={control}
      />

      <Divider sx={{ my: 3 }} />

      {/* 基本情報セクション（下部） */}
      <MetadataSection register={register} errors={errors} />

      <Divider sx={{ my: 2 }} />

      {/* 読み取り専用項目 */}
      <ReadonlySection
        duration={duration}
        createdAt={created_at}
        path={path}
      />
    </Box>
  );
};

/**
 * 評価セクション（レート、タグ、原曲情報、管理メモ）
 */
const EvaluationSection = memo<{
  register: UseFormRegister<SingleTrackProperty>;
  errors: FieldErrors<SingleTrackProperty>;
  control: Control<SingleTrackProperty>;
}>(({ register, errors, control }) => {
  return (
    <Stack spacing={2}>
      {/* タグ */}
      <Box>
        <Button variant="outlined" size="small">
          タグを編集（未実装）
        </Button>
      </Box>

      {/* レート */}
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          レート
        </Typography>
        <FormRating control={control} name="rating" />
      </Box>

      {/* 原曲情報 */}
      <TextField
        {...register("original_track")}
        label="原曲情報"
        fullWidth
        size="small"
        error={!!errors.original_track}
        helperText={errors.original_track?.message}
      />

      {/* アルバム推薦対象 */}
      <FormCheckbox
        control={control}
        name="suggest_target"
        label="アルバム推薦対象"
      />

      {/* 管理メモ */}
      <TextField
        {...register("memo_manage")}
        label="管理メモ"
        fullWidth
        multiline
        rows={3}
        size="small"
        error={!!errors.memo_manage}
        helperText={errors.memo_manage?.message}
      />
    </Stack>
  );
});

/**
 * メタデータセクション（タイトル、アーティスト、アルバム等）
 */
const MetadataSection = memo<{
  register: UseFormRegister<SingleTrackProperty>;
  errors: FieldErrors<SingleTrackProperty>;
}>(({ register, errors }) => {
  return (
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

      {/* トラック番号 */}
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
      </Box>

      {/* ディスク番号 */}
      <Box sx={{ display: "flex", gap: 2 }}>
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
    </Stack>
  );
});

/**
 * 読み取り専用セクション（再生時間、登録日、ファイルパス）
 */
const ReadonlySection = memo<{
  duration: number;
  createdAt: string;
  path: string;
}>(({ duration, createdAt, path }) => {
  return (
    <Stack spacing={2} direction="row">
      <Box>
        <Typography variant="caption" color="text.secondary">
          再生時間
        </Typography>
        <Typography variant="body2">
          {formatDuration(duration)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          登録日
        </Typography>
        <Typography variant="body2">{createdAt}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          ファイルパス
        </Typography>
        <Typography variant="body2" noWrap>{path}</Typography>
      </Box>
    </Stack>
  );
});

/**
 * 再生時間の文字列化
 * @param duration 再生時間 (ミリ秒)
 */
function formatDuration(duration: number): string {
  const sec = Math.floor(duration % 60000 / 1000);
  const min = Math.floor(duration % 3600000 / 60000);
  const hour = Math.floor(duration / 3600000);

  if (hour == 0) {
    return `${min}:${format02d(sec)}`;
  } else {
    return `${hour}:${format02d(min)}:${format02d(sec)}`;
  }
}

function format02d(num: number): string {
  return num.toString().padStart(2, "0");
}

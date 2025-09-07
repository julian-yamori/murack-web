import { SingleTrackProperty } from "../../gen/backend_api.ts";

/**
 * フォームデータとDBデータを比較して編集状態を判定する
 */
export const isFormEdited = (
  formData: SingleTrackProperty,
  dbData: SingleTrackProperty,
): boolean => {
  // 基本項目の比較（null/undefined を空文字として扱う）
  const safeCompare = (
    a: string | null | undefined,
    b: string | null | undefined,
  ) => (a ?? "") === (b ?? "");

  if (!safeCompare(formData.title, dbData.title)) return true;
  if (!safeCompare(formData.artist, dbData.artist)) return true;
  if (!safeCompare(formData.album_artist, dbData.album_artist)) return true;
  if (!safeCompare(formData.album, dbData.album)) return true;
  if (!safeCompare(formData.genre, dbData.genre)) return true;
  if (!safeCompare(formData.composer, dbData.composer)) return true;
  if (!safeCompare(formData.memo, dbData.memo)) return true;
  if (!safeCompare(formData.memo_manage, dbData.memo_manage)) return true;
  if (!safeCompare(formData.original_track, dbData.original_track)) return true;
  if (!safeCompare(formData.lyrics, dbData.lyrics)) return true;

  // 数値項目の比較（null/undefined は null として扱う）
  const safeNumCompare = (
    a: number | null | undefined,
    b: number | null | undefined,
  ) => (a ?? null) === (b ?? null);

  if (!safeNumCompare(formData.track_number, dbData.track_number)) return true;
  if (!safeNumCompare(formData.track_max, dbData.track_max)) return true;
  if (!safeNumCompare(formData.disc_number, dbData.disc_number)) return true;
  if (!safeNumCompare(formData.disc_max, dbData.disc_max)) return true;

  // 日付の比較
  if (!safeCompare(formData.release_date, dbData.release_date)) return true;

  // レート（数値）の比較
  if (formData.rating !== dbData.rating) return true;

  // 真偽値の比較
  if (formData.suggest_target !== dbData.suggest_target) return true;

  // タグ配列の比較（IDのSetで比較）
  const formTagIds = new Set(formData.tags?.map((t) => t.id) || []);
  const dbTagIds = new Set(dbData.tags?.map((t) => t.id) || []);

  if (formTagIds.size !== dbTagIds.size) return true;
  if ([...formTagIds].some((id) => !dbTagIds.has(id))) return true;

  return false; // 変更なし
};

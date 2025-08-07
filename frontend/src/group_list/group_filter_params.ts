/** グループ選択画面で選択された、絞り込み検索の条件 */
export type GroupFilterParams = Readonly<{
  artist?: string;
  album?: string;
  genre?: string;
}>;

export function is_empty_params(
  params: GroupFilterParams | undefined,
): boolean {
  if (params === undefined) {
    return true;
  }

  const { artist, album, genre } = params;

  return artist === undefined && album === undefined && genre === undefined;
}

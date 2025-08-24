import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetGenreList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { ArtistListPage } from "./ArtistListPage.tsx";
import { GroupFilterParams, is_empty_params } from "./group_filter_params.ts";

export const GenreListPage: React.FC<{
  filterParams?: GroupFilterParams;
}> = ({
  filterParams,
}) => {
  const { data, error } = useGetGenreList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData | "all") => {
    if (item === "all") {
      // ジャンルを絞り込まずにアーティスト選択画面に遷移
      pushPage({
        render: () => <ArtistListPage filterParams={filterParams} />,
        navigationMenuKey: undefined,
        breadCrumb: ALL_GENRE,
      });
    } else {
      const currentFilter = filterParams ?? {};

      // アーティスト選択画面に遷移
      pushPage({
        render: () => (
          <ArtistListPage
            filterParams={{ ...currentFilter, genre: item.name }}
          />
        ),
        navigationMenuKey: undefined,
        breadCrumb: nextBreadCrumb(item),
      });
    }
  };

  return (
    <GroupListLayout
      list_data={data?.data}
      error={error}
      // NavigationMenu の直下でなければ「全ての XX」を表示
      allItemText={is_empty_params(filterParams) ? undefined : ALL_GENRE}
      emptyItemText={UNKNOWN_GENRE}
      onItemClick={handleItemClick}
    />
  );
};

const ALL_GENRE = "全てのジャンル";
const UNKNOWN_GENRE = "不明なジャンル";

/** リスト要素が選択されて次画面に遷移するときの、パンくずリストに表示する名前 */
function nextBreadCrumb(item: GroupListItemData): string | undefined {
  if (item.name === "") {
    return UNKNOWN_GENRE;
  } else {
    return item.name;
  }
}

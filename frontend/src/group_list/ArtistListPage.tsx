import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetArtistList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { AlbumListPage } from "./AlbumListPage.tsx";
import { GroupFilterParams, is_empty_params } from "./group_filter_params.ts";

export const ArtistListPage: React.FC<{
  filterParams?: GroupFilterParams;
}> = ({
  filterParams,
}) => {
  const { data, error } = useGetArtistList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData | "all") => {
    if (item === "all") {
      // アーティストを絞り込まずにアルバム選択画面に遷移
      pushPage({
        render: () => <AlbumListPage filterParams={filterParams} />,
        navigationMenuKey: undefined,
        breadCrumb: ALL_ARTIST,
      });
    } else {
      const currentFilter = filterParams ?? {};

      // アルバム選択画面に遷移
      pushPage({
        render: () => (
          <AlbumListPage
            filterParams={{ ...currentFilter, artist: item.name }}
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
      allItemText={is_empty_params(filterParams) ? undefined : ALL_ARTIST}
      emptyItemText={UNKNOWN_ARTIST}
      onItemClick={handleItemClick}
    />
  );
};

const ALL_ARTIST = "全てのアーティスト";
const UNKNOWN_ARTIST = "不明なアーティスト";

/** リスト要素が選択されて次画面に遷移するときの、パンくずリストに表示する名前 */
function nextBreadCrumb(item: GroupListItemData): string | undefined {
  if (item.name === "") {
    return UNKNOWN_ARTIST;
  } else {
    return item.name;
  }
}

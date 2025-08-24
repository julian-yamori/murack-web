import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetAlbumList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { GroupTrackListPage } from "./GroupTrackListPage.tsx";
import { is_empty_params } from "./group_filter_params.ts";
import { LoadingErrorAlert } from "../common_components/LoadingErrorAlert.tsx";
import { LoadingView } from "../common_components/LoadingView.tsx";

export const AlbumListPage: React.FC<{
  filterParams?: {
    artist?: string;
    album?: string;
    genre?: string;
  };
}> = ({
  filterParams,
}) => {
  const { data, error } = useGetAlbumList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData | "all") => {
    const currentFilter = filterParams ?? {};

    if (item === "all") {
      // アルバムを絞り込まずに曲リスト画面に遷移
      pushPage({
        render: () => <GroupTrackListPage filterParams={currentFilter} />,
        navigationMenuKey: undefined,
        breadCrumb: ALL_ALBUM,
      });
    } else {
      // 曲リスト画面に遷移
      pushPage({
        render: () => (
          <GroupTrackListPage
            filterParams={{ ...currentFilter, album: item.name }}
          />
        ),
        navigationMenuKey: undefined,
        breadCrumb: nextBreadCrumb(item),
      });
    }
  };

  if (error) {
    return <LoadingErrorAlert error={error} />;
  }
  if (data === undefined) {
    return <LoadingView />;
  }

  return (
    <GroupListLayout
      list_data={data.data}
      // NavigationMenu の直下でなければ「全ての XX」を表示
      allItemText={is_empty_params(filterParams) ? undefined : ALL_ALBUM}
      emptyItemText={UNKNOWN_ALBUM}
      onItemClick={handleItemClick}
    />
  );
};

const ALL_ALBUM = "全てのアルバム";
const UNKNOWN_ALBUM = "不明なアルバム";

/** リスト要素が選択されて次画面に遷移するときの、パンくずリストに表示する名前 */
function nextBreadCrumb(item: GroupListItemData): string | undefined {
  if (item.name === "") {
    return UNKNOWN_ALBUM;
  } else {
    return item.name;
  }
}

import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetAlbumList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { GroupTrackListPage } from "./GroupTrackListPage.tsx";

export const AlbumListPage: React.FC<{
  filterParams?: {
    artist?: string;
    album?: string;
    genre?: string;
  };
}> = ({
  filterParams,
}) => {
  const { data, error, isLoading } = useGetAlbumList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData) => {
    const currentFilter = filterParams ?? {};

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
  };

  return (
    <GroupListLayout
      list_data={data?.data}
      error={error}
      isLoading={isLoading}
      emptyItemText={UNKNOWN_ALBUM}
      onItemClick={handleItemClick}
    />
  );
};

const UNKNOWN_ALBUM = "不明なアルバム";

/** リスト要素が選択されて次画面に遷移するときの、パンくずリストに表示する名前 */
function nextBreadCrumb(item: GroupListItemData): string | undefined {
  if (item.name === "") {
    return UNKNOWN_ALBUM;
  } else {
    return item.name;
  }
}

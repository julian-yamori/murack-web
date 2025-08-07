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
      breadCrumb: item.name,
    });
  };

  return (
    <GroupListLayout
      list_data={data?.data}
      error={error}
      isLoading={isLoading}
      onItemClick={handleItemClick}
    />
  );
};

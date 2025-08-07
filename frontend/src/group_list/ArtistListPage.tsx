import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetArtistList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { AlbumListPage } from "./AlbumListPage.tsx";

export const ArtistListPage: React.FC<{
  filterParams?: {
    artist?: string;
    album?: string;
    genre?: string;
  };
}> = ({
  filterParams,
}) => {
  const { data, error, isLoading } = useGetArtistList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData) => {
    const currentFilter = filterParams ?? {};

    // アルバム選択画面に遷移
    pushPage({
      render: () => (
        <AlbumListPage filterParams={{ ...currentFilter, artist: item.name }} />
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

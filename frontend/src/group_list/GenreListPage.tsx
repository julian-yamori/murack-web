import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetGenreList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { ArtistListPage } from "./ArtistListPage.tsx";

export const GenreListPage: React.FC<{
  filterParams?: {
    artist?: string;
    album?: string;
    genre?: string;
  };
}> = ({
  filterParams,
}) => {
  const { data, error, isLoading } = useGetGenreList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData) => {
    const currentFilter = filterParams ?? {};

    // アーティスト選択画面に遷移
    pushPage({
      render: () => (
        <ArtistListPage
          filterParams={{ ...currentFilter, genre: item.name }}
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

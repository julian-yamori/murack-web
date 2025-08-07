import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetAlbumList,
} from "../gen/backend_api.ts";

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

  const handleItemClick = (item: GroupListItemData) => {
    // TODO: ナビゲーション処理を実装
    console.log("Clicked album:", item);
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

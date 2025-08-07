import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetGenreList,
} from "../gen/backend_api.ts";

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

  const handleItemClick = (item: GroupListItemData) => {
    // TODO: ナビゲーション処理を実装
    console.log("Clicked genre:", item);
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

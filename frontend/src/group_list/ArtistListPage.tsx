import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetArtistList,
} from "../gen/backend_api.ts";

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

  const handleItemClick = (item: GroupListItemData) => {
    // TODO: ナビゲーション処理を実装
    console.log("Clicked artist:", item);
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

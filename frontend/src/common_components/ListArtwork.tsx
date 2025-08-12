import { Avatar } from "@mui/material";
import { API_BASE_URL } from "../api_base_url.ts";

/** リストのアートワーク画像のコンポーネント */
export const ListArtwork: React.FC<
  { artworkId: number | null | undefined; size: number }
> = (
  { artworkId, size },
) => {
  return (
    <Avatar
      src={getArtworkSrc(artworkId)}
      variant="rounded"
      sx={{
        width: size,
        height: size,
        mr: 2,
      }}
    />
  );
};

function getArtworkSrc(artworkId: number | null | undefined): string {
  if (artworkId === null || artworkId === undefined) {
    return "/artwork_none.png";
  }
  return `${API_BASE_URL}/api/artworks/${artworkId}/mini`;
}

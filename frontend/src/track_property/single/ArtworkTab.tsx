import React from "react";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { TrackArtwork } from "../../gen/backend_api.ts";
import { API_BASE_URL } from "../../api_base_url.ts";

interface ArtworkTabProps {
  artworks: TrackArtwork[];
}

export const ArtworkTab: React.FC<ArtworkTabProps> = ({ artworks }) => {
  if (!artworks || artworks.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          アートワークがありません
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
        }}
      >
        {artworks.map((artwork, index) => (
          <Card key={index} sx={{ maxWidth: 300 }}>
            <CardMedia
              component="img"
              image={`${API_BASE_URL}/api/artworks/${artwork.artwork_id}/original`}
              alt={`アートワーク ${index + 1}`}
              sx={{
                aspectRatio: "1/1",
                objectFit: "contain",
                backgroundColor: "grey.100",
              }}
            />
            <Box sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Type: {artwork.picture_type}
                <br />
                {artwork.description}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

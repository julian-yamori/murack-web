use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct Song {
    pub id: i32,
    pub title: String,
    pub artist: String,
    pub album: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct CreateSongRequest {
    pub title: String,
    pub artist: String,
    pub album: Option<String>,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct UpdateSongRequest {
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
}

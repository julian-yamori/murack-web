use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct TagGroup {
    pub id: i32,
    pub name: String,
    pub order_index: i32,
    pub description: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct CreateTagGroupRequest {
    pub name: String,
    pub order_index: i32,
    pub description: String,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct UpdateTagGroupRequest {
    pub name: Option<String>,
    pub order_index: Option<i32>,
    pub description: Option<String>,
}

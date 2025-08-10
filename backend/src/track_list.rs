use serde::Serialize;
use sqlx::prelude::FromRow;
use utoipa::ToSchema;

/// 曲リスト画面に返すリスト要素データ
#[derive(Debug, PartialEq, Eq, Serialize, FromRow, ToSchema)]
pub struct TrackListItem {
    /// 曲の ID
    pub id: i32,

    /// 曲名
    pub title: String,

    pub artwork_id: Option<i32>,

    /// 再生時間 (ミリ秒)
    pub duration: i32,
}

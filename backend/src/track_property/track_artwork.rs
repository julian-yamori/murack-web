use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgTransaction};
use utoipa::ToSchema;

/// 曲のプロパティ画面で使用する、アートワーク一つの曲との紐付き情報
#[derive(Debug, PartialEq, Eq, Serialize, Deserialize, FromRow, ToSchema)]
pub struct TrackArtwork {
    artwork_id: i32,

    /// 画像タイプ
    ///
    /// FLACやID3で定義された、0〜20の値
    picture_type: i32,

    /// 画像の説明
    description: String,
}

impl TrackArtwork {
    /// 曲の ID を指定して TrackArtwork を取得 (ソート済み)
    pub async fn from_db_by_track<'c>(
        tx: &mut PgTransaction<'c>,
        track_id: i32,
    ) -> sqlx::Result<Vec<Self>> {
        sqlx::query_as!(
            Self,
            "
            SELECT artwork_id, picture_type, description
            FROM track_artworks
            WHERE track_id = $1
            ORDER BY order_index
            ",
            track_id
        )
        .fetch_all(&mut **tx)
        .await
    }
}

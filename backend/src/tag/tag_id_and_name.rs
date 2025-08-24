use murack_core_domain::NonEmptyString;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgTransaction};
use utoipa::ToSchema;

/// タグの id と名前をまとめた構造体
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, FromRow, ToSchema)]
pub struct TagIdAndName {
    id: i32,
    name: NonEmptyString,
}

impl TagIdAndName {
    /// 曲の ID を指定して TagIdAndName を取得 (ソート済み)
    pub async fn from_db_by_track<'c>(
        tx: &mut PgTransaction<'c>,
        track_id: i32,
    ) -> sqlx::Result<Vec<Self>> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT
                t.id,
                t.name AS "name: NonEmptyString"
            FROM track_tags as tt
            INNER JOIN tags as t
                ON tt.tag_id = t.id
            INNER JOIN tag_groups as g
                ON t.group_id = g.id
            WHERE tt.track_id = $1
            ORDER BY g.order_index ASC, t.order_index ASC
            "#,
            track_id
        )
        .fetch_all(&mut **tx)
        .await
    }
}

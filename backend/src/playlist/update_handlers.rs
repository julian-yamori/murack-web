//! プレイリストの情報更新系の API

use anyhow::bail;
use axum::extract::{Json, Path, State};
use murack_core_domain::{
    SortTypeWithPlaylist,
    playlist::{PlaylistType, playlist_sqls},
};
use serde::Deserialize;
use sqlx::PgTransaction;
use utoipa::ToSchema;

use crate::{AppState, error_handling::ApiResult};

// プレイリストの曲のソートの種類を更新
#[utoipa::path(
    put,
    path = "/api/playlists/{id}/sort-type",
    params(
        ("id", description = "Playlist ID")
    ),
)]
pub async fn update_playlist_sort_type(
    Path(id): Path<i32>,
    State(pool): State<AppState>,
    Json(sort_type): Json<SortTypeWithPlaylist>,
) -> ApiResult<()> {
    let mut tx = pool.begin().await?;

    validate_sort_type(&mut tx, sort_type, id).await?;

    sqlx::query!(
        "UPDATE playlists SET sort_type = $1 WHERE id = $2",
        sort_type as SortTypeWithPlaylist,
        id
    )
    .execute(&mut *tx)
    .await?;

    // DAP変更フラグを立てる
    playlist_sqls::set_dap_changed(&mut tx, id, true).await?;

    tx.commit().await?;

    Ok(())
}

// 登録しようとしている SortType がプレイリストに適しているか確認
async fn validate_sort_type<'c>(
    tx: &mut PgTransaction<'c>,
    sort_type: SortTypeWithPlaylist,
    playlist_id: i32,
) -> anyhow::Result<()> {
    if sort_type != SortTypeWithPlaylist::Playlist {
        return Ok(());
    }

    let playlist_type = sqlx::query_scalar!(
        r#"SELECT playlist_type AS "playlist_type: PlaylistType" FROM playlists where id = $1"#,
        playlist_id
    )
    .fetch_one(&mut **tx)
    .await?;

    if playlist_type == PlaylistType::Normal {
        Ok(())
    } else {
        bail!("'playlist' sort type is not allowed for playlist type '{playlist_type:?}'")
    }
}

#[derive(Debug, PartialEq, Eq, Deserialize, ToSchema)]
pub struct UpdateSortDescRequest {
    sort_desc: bool,
}

// プレイリストの曲の降順ソートフラグを更新
#[utoipa::path(
    put,
    path = "/api/playlists/{id}/sort-desc",
    params(
        ("id", description = "Playlist ID")
    ),
)]
pub async fn update_playlist_sort_desc(
    Path(id): Path<i32>,
    State(pool): State<AppState>,
    Json(request): Json<UpdateSortDescRequest>,
) -> ApiResult<()> {
    let UpdateSortDescRequest { sort_desc } = request;

    let mut tx = pool.begin().await?;

    sqlx::query!(
        "UPDATE playlists SET sort_desc = $1 WHERE id = $2",
        sort_desc,
        id
    )
    .execute(&mut *tx)
    .await?;

    // DAP変更フラグを立てる
    playlist_sqls::set_dap_changed(&mut tx, id, true).await?;

    tx.commit().await?;

    Ok(())
}

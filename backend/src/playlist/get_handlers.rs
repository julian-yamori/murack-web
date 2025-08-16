//! プレイリストの情報取得系の API

use axum::{
    Json,
    extract::{Path, Query, State},
};
use murack_core_domain::{NonEmptyString, SortTypeWithPlaylist, playlist::PlaylistType};
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

use crate::{AppState, error_handling::ApiResult};

/// プレイリスト一覧画面のリスト要素
#[derive(Debug, PartialEq, Eq, Serialize, ToSchema)]
pub struct PlaylistListItem {
    /// プレイリストID
    pub id: i32,

    /// プレイリストの種類
    pub playlist_type: PlaylistType,

    /// プレイリスト名
    pub name: NonEmptyString,
}

#[derive(Debug, Deserialize, IntoParams)]
pub struct PlaylistListQuery {
    /// 検索対象リストの親プレイリスト ID。指定しない場合は最上位のプレイリストのみを検索
    pub parent_id: Option<i32>,
}

/// プレイリスト一覧画面のためのリスト要素を取得
#[utoipa::path(
    get,
    path = "/api/playlists/list",
    params(
        PlaylistListQuery
    ),
    responses(
        (status = 200, body = Vec<PlaylistListItem>, description = "parentId で指定されたプレイリストの、子プレイリストのリスト要素")
    )
)]
pub async fn get_playlist_list(
    Query(query): Query<PlaylistListQuery>,
    State(pool): State<AppState>,
) -> ApiResult<Json<Vec<PlaylistListItem>>> {
    let items = sqlx::query_as!(
        PlaylistListItem,
        r#"
        SELECT
          id,
          playlist_type AS "playlist_type: PlaylistType",
          name AS "name: NonEmptyString"
        FROM playlists
        WHERE parent_id IS NOT DISTINCT FROM $1
        ORDER BY in_folder_order
        "#,
        query.parent_id
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(items))
}

/// プレイリストの、プレイリスト一覧・曲一覧画面で利用する情報のみを抽出した詳細情報
#[derive(Debug, PartialEq, Eq, Serialize, ToSchema)]
pub struct PlaylistDetails {
    /// プレイリストID
    pub id: i32,

    /// プレイリストの種類
    pub playlist_type: PlaylistType,

    /// プレイリスト名
    pub name: NonEmptyString,

    /// 親プレイリストID
    pub parent_id: Option<i32>,

    /// ソート対象
    pub sort_type: SortTypeWithPlaylist,

    /// ソートが降順か
    pub sort_desc: bool,

    /// DAPにこのプレイリストを保存するか
    pub save_dap: bool,
}

/// プレイリスト一つの詳細情報を取得
#[utoipa::path(
    get,
    path = "/api/playlists/{id}",
    params(
        ("id", description = "Playlist ID")
    ),
    responses(
        (status = 200, body = PlaylistDetails)
    )
)]
pub async fn get_playlist_details(
    Path(id): Path<i32>,
    State(pool): State<AppState>,
) -> ApiResult<Json<PlaylistDetails>> {
    let plist = sqlx::query_as!(
        PlaylistDetails,
        r#"
        SELECT
          id,
          playlist_type AS "playlist_type: PlaylistType",
          name AS "name: NonEmptyString",
          parent_id,
          sort_type AS "sort_type: SortTypeWithPlaylist",
          sort_desc,
          save_dap
        FROM playlists
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(plist))
}

#[cfg(test)]
pub mod tests;

use anyhow::anyhow;
use axum::{
    Json,
    extract::{Query, State},
};
use murack_core_domain::SortType;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row, postgres::PgRow};
use utoipa::{IntoParams, ToSchema};

use crate::{
    AppState,
    error_handling::ApiResult,
    group_list::{GroupColumn, GroupQuery, group_query::GroupQueryValue},
    track_list::TrackListItem,
};

/// グループ選択画面のリスト要素
#[derive(Debug, PartialEq, Eq, Serialize, ToSchema)]
pub struct GroupListItem {
    /// アーティスト名などの値
    pub name: String,

    pub artwork_id: Option<i32>,
}

/// グループ選択画面用にジャンルのリストを検索
#[utoipa::path(
    get,
    path = "/api/group_list/genre_list",
    params(
        GroupQuery
    ),
    responses(
        (status = 200, body = Vec<GroupListItem>)
    )
)]
pub async fn get_genre_list(
    Query(mut group_query): Query<GroupQuery>,
    State(pool): State<AppState>,
) -> ApiResult<Json<Vec<GroupListItem>>> {
    let names = get_names_generic(GroupColumn::Genre, &group_query, &pool).await?;

    // ジャンル名ごとにアートワーク ID を取得
    let mut list_items = Vec::<GroupListItem>::new();
    for name in names {
        // clone 回避のため、検索用の GroupQuery を使いまわす。
        // 使い終わったら name を GroupQuery から回収する
        group_query.genre = Some(name);

        let artwork_id = get_artwork_id(&pool, &group_query).await?;

        let name = group_query.genre.unwrap();

        list_items.push(GroupListItem { name, artwork_id });
    }

    Ok(Json(list_items))
}

/// グループ選択画面用にアーティストのリストを検索
#[utoipa::path(
    get,
    path = "/api/group_list/artist_list",
    params(
        GroupQuery
    ),
    responses(
        (status = 200, body = Vec<GroupListItem>)
    )
)]
pub async fn get_artist_list(
    Query(mut group_query): Query<GroupQuery>,
    State(pool): State<AppState>,
) -> ApiResult<Json<Vec<GroupListItem>>> {
    let names = get_names_generic(GroupColumn::Artist, &group_query, &pool).await?;

    // アーティスト名ごとにアートワーク ID を取得
    let mut list_items = Vec::<GroupListItem>::new();
    for name in names {
        // clone 回避のため、検索用の GroupQuery を使いまわす。
        // 使い終わったら name を GroupQuery から回収する
        group_query.artist = Some(name);

        let artwork_id = get_artwork_id(&pool, &group_query).await?;

        let name = group_query.artist.unwrap();

        list_items.push(GroupListItem { name, artwork_id });
    }

    Ok(Json(list_items))
}

/// グループ選択画面用にアルバムのリストを検索
#[utoipa::path(
    get,
    path = "/api/group_list/album_list",
    params(
        GroupQuery
    ),
    responses(
        (status = 200, body = Vec<GroupListItem>)
    )
)]
pub async fn get_album_list(
    Query(mut group_query): Query<GroupQuery>,
    State(pool): State<AppState>,
) -> ApiResult<Json<Vec<GroupListItem>>> {
    // アルバム名のリストを取得
    let names = get_names_generic(GroupColumn::Album, &group_query, &pool).await?;

    // アルバム名ごとにアートワーク ID を取得
    let mut list_items = Vec::<GroupListItem>::new();
    for name in names {
        // clone 回避のため、検索用の GroupQuery を使いまわす。
        // 使い終わったら name を GroupQuery から回収する
        group_query.album = Some(name);

        let artwork_id = get_artwork_id(&pool, &group_query).await?;

        let name = group_query.album.unwrap();

        list_items.push(GroupListItem { name, artwork_id });
    }

    Ok(Json(list_items))
}

/// name_target で指定した項目の名前リストを検索
async fn get_names_generic(
    name_target: GroupColumn,
    group_query: &GroupQuery,
    pool: &PgPool,
) -> anyhow::Result<Vec<String>> {
    // name_target に応じてカラム名を分岐
    let name_column = name_target.column_query();
    let order_column = name_target.order_query();

    // name: 取得する曲のカラムの値
    // order_column: ORDER BY でソートする値
    let mut query_base = format!(
        "SELECT DISTINCT {name_column} AS name, {order_column} AS order_column FROM tracks"
    );

    // 条件があるなら連結
    if let Some(where_query) = group_query.where_query() {
        query_base.push_str(" WHERE ");
        query_base.push_str(&where_query);
    }

    // SELECT で読み替えたカラム名でソート
    query_base.push_str(" ORDER BY order_column ASC");

    // SQL を実行し、検索対象の名前を取得
    let names: Vec<String> = sqlx::query(&query_base)
        .map(|r: PgRow| r.get("name"))
        .fetch_all(pool)
        .await?;
    Ok(names)
}

/// グループ選択に応じたアートワーク ID を取得
async fn get_artwork_id(pool: &PgPool, group_query: &GroupQuery) -> anyhow::Result<Option<i32>> {
    let where_query = group_query
        .where_query()
        .ok_or_else(|| anyhow!("group query is empty in get_artwork_id()"))?;

    // tracks レコードと最初のアートワークレコードを紐づけ、
    // リリースが一番新しい (その後はアーティスト昇順と同様の順序で) 1 曲を選出。
    // そのアートワーク ID を取得。
    let sql = format!(
        "
        SELECT ta.artwork_id
        FROM track_artworks ta
        INNER JOIN tracks ON ta.track_id = tracks.id
        WHERE ta.order_index = 0 
          AND {where_query}
        ORDER BY 
            release_date DESC,
            artist_order ASC,
            album_order ASC,
            disc_number ASC,
            track_number ASC,
            title_order ASC,
            tracks.id ASC
        LIMIT 1
        "
    );

    let image_id: Option<i32> = sqlx::query_scalar(&sql).fetch_optional(pool).await?;

    Ok(image_id)
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, IntoParams)]
pub struct GetTrackListParams {
    #[param(value_type = Option<String>)]
    pub artist: GroupQueryValue,

    #[param(value_type = Option<String>)]
    pub album: GroupQueryValue,

    #[param(value_type = Option<String>)]
    pub genre: GroupQueryValue,

    pub sort_type: SortType,

    pub sort_desc: bool,

    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

/// グループ選択に応じた曲リストを取得
#[utoipa::path(
    get,
    path = "/api/group_list/track_list",
    params(
        GetTrackListParams
    ),
    responses(
        (status = 200, body = Vec<TrackListItem>)
    )
)]
pub async fn get_track_list(
    Query(params): Query<GetTrackListParams>,
    State(pool): State<AppState>,
) -> ApiResult<Json<Vec<TrackListItem>>> {
    let GetTrackListParams {
        artist,
        album,
        genre,
        sort_type,
        sort_desc,
        limit,
        offset,
    } = params;

    let group_query = GroupQuery {
        artist,
        album,
        genre,
    };

    // tracks テーブルの値と、曲ごとに紐づく最初のアートワークの ID を取得
    let mut sql = "
        SELECT
            tracks.id,
            title,
            (
                SELECT artwork_id
                FROM track_artworks
                WHERE track_id = tracks.id AND order_index = 0
            ) AS artwork_id,
            duration
        FROM tracks"
        .to_string();

    if let Some(where_query) = group_query.where_query() {
        sql.push_str(" WHERE ");
        sql.push_str(&where_query);
    }

    sql.push_str(" ORDER BY ");
    sql.push_str(&sort_type.order_query(sort_desc));

    if let Some(limit) = limit {
        sql.push_str(" LIMIT ");
        sql.push_str(&limit.to_string());
    }
    if let Some(offset) = offset {
        sql.push_str(" OFFSET ");
        sql.push_str(&offset.to_string());
    }

    let items: Vec<TrackListItem> = sqlx::query_as(&sql).fetch_all(&pool).await?;

    Ok(Json(items))
}

use axum::{
    Json,
    extract::{Query, State},
};
use sqlx::PgPool;

use crate::{
    error_handling::ApiResult,
    group_list::{GroupColumn, GroupQuery},
};

/// グループ選択画面用にジャンル名を検索
#[utoipa::path(
    get,
    path = "/api/group_list/genres",
    params(
        GroupQuery
    ),
    responses(
        (status = 200, body = Vec<String>)
    )
)]
pub async fn get_genre_names(
    Query(group_query): Query<GroupQuery>,
    State(pool): State<PgPool>,
) -> ApiResult<Json<Vec<String>>> {
    get_names_generic(GroupColumn::Genre, &group_query, &pool).await
}

/// グループ選択画面用にアーティスト名を検索
#[utoipa::path(
    get,
    path = "/api/group_list/artists",
    params(
        GroupQuery
    ),
    responses(
        (status = 200, body = Vec<String>)
    )
)]
pub async fn get_artist_names(
    Query(group_query): Query<GroupQuery>,
    State(pool): State<PgPool>,
) -> ApiResult<Json<Vec<String>>> {
    get_names_generic(GroupColumn::Artist, &group_query, &pool).await
}

/// グループ選択画面用にアルバム名を検索
#[utoipa::path(
    get,
    path = "/api/group_list/albums",
    params(
        GroupQuery
    ),
    responses(
        (status = 200, body = Vec<String>)
    )
)]
pub async fn get_album_names(
    Query(group_query): Query<GroupQuery>,
    State(pool): State<PgPool>,
) -> ApiResult<Json<Vec<String>>> {
    get_names_generic(GroupColumn::Album, &group_query, &pool).await
}

/// name_target で指定した項目の名前リストを検索
async fn get_names_generic(
    name_target: GroupColumn,
    group_query: &GroupQuery,
    pool: &PgPool,
) -> ApiResult<Json<Vec<String>>> {
    // 基本的なアプローチ：まずDISTINCTでユニークな値を取得してからORDER BYでソート
    let mut query_base = String::from("SELECT DISTINCT ");

    // 必要な列を追加（DISTINCT対象とORDER BY対象の両方）
    match name_target {
        GroupColumn::Genre => {
            query_base.push_str("genre, genre_order FROM tracks");
        }
        GroupColumn::Artist => {
            query_base.push_str("(CASE album_artist WHEN '' THEN artist ELSE album_artist END) as artist_name, (CASE album_artist_order WHEN '' THEN artist_order ELSE album_artist_order END) as artist_order_name FROM tracks");
        }
        GroupColumn::Album => {
            query_base.push_str("album, album_order FROM tracks");
        }
    }

    // 条件があるなら連結
    if let Some(where_query) = group_query.where_query() {
        query_base.push_str(" WHERE ");
        query_base.push_str(&where_query);
    }

    // ソート追加
    match name_target {
        GroupColumn::Genre => {
            query_base.push_str(" ORDER BY genre_order ASC");
        }
        GroupColumn::Artist => {
            query_base.push_str(" ORDER BY artist_order_name ASC");
        }
        GroupColumn::Album => {
            query_base.push_str(" ORDER BY album_order ASC");
        }
    }

    // SQL を実行

    // 結果取得方式を変更：構造体で取得してから値だけ抽出
    match name_target {
        GroupColumn::Genre => {
            #[derive(sqlx::FromRow)]
            struct GenreRow {
                genre: String,
            }
            let rows: Vec<GenreRow> = sqlx::query_as(&query_base).fetch_all(pool).await?;
            let names: Vec<String> = rows.into_iter().map(|r| r.genre).collect();
            Ok(Json(names))
        }
        GroupColumn::Artist => {
            #[derive(sqlx::FromRow)]
            struct ArtistRow {
                artist_name: String,
            }
            let rows: Vec<ArtistRow> = sqlx::query_as(&query_base).fetch_all(pool).await?;
            let names: Vec<String> = rows.into_iter().map(|r| r.artist_name).collect();
            Ok(Json(names))
        }
        GroupColumn::Album => {
            #[derive(sqlx::FromRow)]
            struct AlbumRow {
                album: String,
            }
            let rows: Vec<AlbumRow> = sqlx::query_as(&query_base).fetch_all(pool).await?;
            let names: Vec<String> = rows.into_iter().map(|r| r.album).collect();
            Ok(Json(names))
        }
    }
}

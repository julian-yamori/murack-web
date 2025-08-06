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
    // 基本文
    let mut query_base = format!("SELECT DISTINCT {} FROM tracks", name_target.column_query());

    // 条件があるなら連結
    if let Some(where_query) = group_query.where_query() {
        query_base.push_str(" WHERE ");
        query_base.push_str(&where_query);
    }

    // ソート追加
    query_base.push_str(&format!(" ORDER BY {} ASC", name_target.order_query()));

    // SQL を実行
    let names = sqlx::query_scalar(&query_base).fetch_all(pool).await?;

    Ok(Json(names))
}

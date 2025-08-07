use axum::{
    Json,
    extract::{Query, State},
};
use sqlx::{PgPool, Row, postgres::PgRow};

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
    Ok(Json(names))
}

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use sqlx::PgPool;

use crate::{
    error_handling::{ApiError, ApiResult},
    test_tag_group::models::{CreateTagGroupRequest, TagGroup, UpdateTagGroupRequest},
};

#[utoipa::path(
    get,
    path = "/api/tag_groups",
    responses(
        (status = 200, description = "List all tag groups", body = [TagGroup])
    )
)]
pub async fn get_tag_groups(State(pool): State<PgPool>) -> ApiResult<Json<Vec<TagGroup>>> {
    let tag_groups = sqlx::query_as!(
        TagGroup,
        "SELECT id, name, order_index, description, created_at FROM tag_groups ORDER BY order_index ASC",
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(tag_groups))
}

#[utoipa::path(
    post,
    path = "/api/tag_groups",
    request_body = CreateTagGroupRequest,
    responses(
        (status = 201, description = "Tag group created successfully", body = TagGroup)
    )
)]
pub async fn create_tag_group(
    State(pool): State<PgPool>,
    Json(request): Json<CreateTagGroupRequest>,
) -> ApiResult<(StatusCode, Json<TagGroup>)> {
    let tag_group = sqlx::query_as!(TagGroup,
        "INSERT INTO tag_groups (name, order_index, description) VALUES ($1, $2, $3) RETURNING id, name, order_index, description, created_at",
        &request.name,
        &request.order_index,
        &request.description,
    )
    .fetch_one(&pool)
    .await?;

    Ok((StatusCode::CREATED, Json(tag_group)))
}

#[utoipa::path(
    put,
    path = "/api/tag_groups/{id}",
    params(
        ("id" = i32, Path, description = "Tag group ID")
    ),
    request_body = UpdateTagGroupRequest,
    responses(
        (status = 200, description = "Tag group updated successfully", body = TagGroup),
        (status = 404, description = "Tag group not found")
    )
)]
pub async fn update_tag_group(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
    Json(request): Json<UpdateTagGroupRequest>,
) -> ApiResult<Json<TagGroup>> {
    // First check if group exists
    let existing_group = sqlx::query_as!(
        TagGroup,
        "SELECT id, name, order_index, description, created_at FROM tag_groups WHERE id = $1",
        id
    )
    .fetch_one(&pool)
    .await?;

    // Update with new values or keep existing ones
    let name = request.name.unwrap_or(existing_group.name);
    let order_index = request.order_index.unwrap_or(existing_group.order_index);
    let description = request.description.unwrap_or(existing_group.description);

    let updated_group = sqlx::query_as!( TagGroup,
        "UPDATE tag_groups SET name = $1, order_index = $2, description = $3 WHERE id = $4 RETURNING id, name, order_index, description, created_at",
        &name,
        &order_index,
        &description,
        id,
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(updated_group))
}

#[utoipa::path(
    delete,
    path = "/api/tag_groups/{id}",
    params(
        ("id" = i32, Path, description = "Tag group ID")
    ),
    responses(
        (status = 204, description = "Tag group deleted successfully"),
        (status = 404, description = "Tag group not found")
    )
)]
pub async fn delete_tag_group(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> ApiResult<StatusCode> {
    let result = sqlx::query!("DELETE FROM tag_groups WHERE id = $1", id)
        .execute(&pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(ApiError::no_rows_affected());
    }

    Ok(StatusCode::NO_CONTENT)
}

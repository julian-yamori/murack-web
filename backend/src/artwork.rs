use axum::{
    extract::{Path, State},
    http::{StatusCode, header},
    response::{IntoResponse, Response},
};
use sqlx::PgPool;

use crate::error_handling::ApiResult;

/// リスト用の mini サイズのアートワークを取得
#[utoipa::path(
    get,
    path = "/api/artworks/{id}/mini",
    params(
        ("id", description = "Artwork ID")
    ),
    responses(
        (status = 200, content_type = "image/jpeg", body = Vec<u8>),
        (status = 404, description = "Artwork not found")
    )
)]
pub async fn get_mini_artwork(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> ApiResult<Response> {
    let image = sqlx::query_scalar!("SELECT image_mini from artworks WHERE id = $1", id)
        .fetch_optional(&pool)
        .await?;

    match image {
        Some(image) => {
            let response = Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, "image/jpeg")
                .body(image.into())?;

            Ok(response)
        }
        None => Ok(StatusCode::NOT_FOUND.into_response()),
    }
}

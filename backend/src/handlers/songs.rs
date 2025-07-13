use crate::models::{CreateSongRequest, Song, UpdateSongRequest};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use sqlx::PgPool;

pub type ApiResult<T> = Result<T, ApiError>;

#[derive(Debug)]
pub struct ApiError {
    pub status: StatusCode,
    pub message: String,
}

impl From<sqlx::Error> for ApiError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => ApiError {
                status: StatusCode::NOT_FOUND,
                message: "Song not found".to_string(),
            },
            _ => ApiError {
                status: StatusCode::INTERNAL_SERVER_ERROR,
                message: format!("Database error: {err}"),
            },
        }
    }
}

impl axum::response::IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (
            self.status,
            Json(serde_json::json!({
                "error": self.message
            })),
        )
            .into_response()
    }
}

#[utoipa::path(
    get,
    path = "/api/songs",
    responses(
        (status = 200, description = "List all songs", body = [Song])
    )
)]
pub async fn get_songs(State(pool): State<PgPool>) -> ApiResult<Json<Vec<Song>>> {
    let songs = sqlx::query_as::<_, Song>(
        "SELECT id, title, artist, album, created_at FROM songs ORDER BY created_at DESC",
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(songs))
}

#[utoipa::path(
    post,
    path = "/api/songs",
    request_body = CreateSongRequest,
    responses(
        (status = 201, description = "Song created successfully", body = Song)
    )
)]
pub async fn create_song(
    State(pool): State<PgPool>,
    Json(request): Json<CreateSongRequest>,
) -> ApiResult<(StatusCode, Json<Song>)> {
    let song = sqlx::query_as::<_, Song>(
        "INSERT INTO songs (title, artist, album) VALUES ($1, $2, $3) RETURNING id, title, artist, album, created_at"
    )
    .bind(&request.title)
    .bind(&request.artist)
    .bind(&request.album)
    .fetch_one(&pool)
    .await?;

    Ok((StatusCode::CREATED, Json(song)))
}

#[utoipa::path(
    put,
    path = "/api/songs/{id}",
    params(
        ("id" = i32, Path, description = "Song ID")
    ),
    request_body = UpdateSongRequest,
    responses(
        (status = 200, description = "Song updated successfully", body = Song),
        (status = 404, description = "Song not found")
    )
)]
pub async fn update_song(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
    Json(request): Json<UpdateSongRequest>,
) -> ApiResult<Json<Song>> {
    // First check if song exists
    let existing_song = sqlx::query_as::<_, Song>(
        "SELECT id, title, artist, album, created_at FROM songs WHERE id = $1",
    )
    .bind(id)
    .fetch_one(&pool)
    .await?;

    // Update with new values or keep existing ones
    let title = request.title.unwrap_or(existing_song.title);
    let artist = request.artist.unwrap_or(existing_song.artist);
    let album = request.album.or(existing_song.album);

    let updated_song = sqlx::query_as::<_, Song>(
        "UPDATE songs SET title = $1, artist = $2, album = $3 WHERE id = $4 RETURNING id, title, artist, album, created_at"
    )
    .bind(&title)
    .bind(&artist)
    .bind(&album)
    .bind(id)
    .fetch_one(&pool)
    .await?;

    Ok(Json(updated_song))
}

#[utoipa::path(
    delete,
    path = "/api/songs/{id}",
    params(
        ("id" = i32, Path, description = "Song ID")
    ),
    responses(
        (status = 204, description = "Song deleted successfully"),
        (status = 404, description = "Song not found")
    )
)]
pub async fn delete_song(Path(id): Path<i32>, State(pool): State<PgPool>) -> ApiResult<StatusCode> {
    let result = sqlx::query("DELETE FROM songs WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(ApiError {
            status: StatusCode::NOT_FOUND,
            message: "Song not found".to_string(),
        });
    }

    Ok(StatusCode::NO_CONTENT)
}

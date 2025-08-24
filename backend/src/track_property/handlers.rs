use axum::{
    Json,
    extract::{Path, State},
};

use crate::{
    AppState,
    error_handling::ApiResult,
    tag::TagIdAndName,
    track_property::{SingleTrackProperty, TrackArtwork, TrackRow},
};

/// 単曲プロパティ画面の情報を取得
#[utoipa::path(
    get,
    path = "/api/tracks/{id}/props",
    params(
        ("id", description = "Track ID")
    ),
    responses(
        (status = 200, body = SingleTrackProperty)
    )
)]
pub async fn get_single_track_prop(
    Path(id): Path<i32>,
    State(pool): State<AppState>,
) -> ApiResult<Json<SingleTrackProperty>> {
    let mut tx = pool.begin().await?;

    let track_row = TrackRow::from_db(&mut tx, id).await?;
    let artworks = TrackArtwork::from_db_by_track(&mut tx, id).await?;
    let tags = TagIdAndName::from_db_by_track(&mut tx, id).await?;

    let TrackRow {
        id,
        path,
        duration,
        created_at,
        title,
        artist,
        album_artist,
        album,
        genre,
        composer,
        track_number,
        track_max,
        disc_number,
        disc_max,
        release_date,
        rating,
        original_track,
        memo,
        memo_manage,
        suggest_target,
        lyrics,
    } = track_row;

    let props = SingleTrackProperty {
        id,
        path,
        duration,
        created_at,
        title,
        artist,
        album_artist,
        album,
        genre,
        composer,
        track_number,
        track_max,
        disc_number,
        disc_max,
        release_date,
        rating,
        original_track,
        memo,
        memo_manage,
        suggest_target,
        lyrics,
        tags,
        artworks,
    };

    Ok(Json(props))
}

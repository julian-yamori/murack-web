use axum::{
    Json,
    extract::{Path, State},
};
use chrono::NaiveDate;
use murack_core_domain::{playlist::playlist_sqls, string_order_cnv};
use serde::Deserialize;
use utoipa::ToSchema;

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

#[derive(Debug, PartialEq, Eq, Deserialize, ToSchema)]
pub struct UpdateSingleTrackPropsRequest {
    /// 曲名
    pub title: String,
    /// アーティスト
    pub artist: String,
    /// アルバムアーティスト
    pub album_artist: String,
    /// アルバム
    pub album: String,
    /// ジャンル
    pub genre: String,
    /// 作曲者
    pub composer: String,

    /// トラック番号
    pub track_number: Option<i32>,
    /// トラック最大数
    pub track_max: Option<i32>,

    /// ディスク番号
    pub disc_number: Option<i32>,
    /// ディスク番号(最大)
    pub disc_max: Option<i32>,

    /// リリース日
    pub release_date: Option<NaiveDate>,

    /// レート (好み)
    pub rating: i16,
    /// 原曲
    pub original_track: String,
    /// メモ
    pub memo: String,
    /// 管理メモ
    pub memo_manage: String,
    /// サジェスト対象フラグ
    pub suggest_target: bool,

    /// 歌詞
    pub lyrics: String,

    /// タグ ID
    pub tag_ids: Vec<i32>,
}

// 単曲プロパティ画面の値でデータベースを更新
#[utoipa::path(
    put,
    path = "/api/tracks/{id}/props",
    params(
        ("id", description = "Track ID")
    ),
)]
pub async fn update_single_track_props(
    Path(track_id): Path<i32>,
    State(pool): State<AppState>,
    Json(track): Json<UpdateSingleTrackPropsRequest>,
) -> ApiResult<()> {
    let mut tx = pool.begin().await?;

    sqlx::query!(
        "
        UPDATE tracks
        SET  title = $1
            ,artist = $2
            ,album_artist = $3
            ,album = $4
            ,genre = $5
            ,composer = $6
            ,track_number = $7
            ,track_max = $8
            ,disc_number = $9
            ,disc_max = $10
            ,release_date = $11
            ,rating = $12
            ,original_track = $13
            ,memo = $14
            ,memo_manage = $15
            ,lyrics = $16
            ,title_order = $17
            ,artist_order = $18
            ,album_artist_order = $19
            ,album_order = $20
            ,composer_order = $21
            ,genre_order = $22
            ,suggest_target = $23
        WHERE id = $24
        ",
        track.title,
        track.artist,
        track.album_artist,
        track.album,
        track.genre,
        track.composer,
        track.track_number,
        track.track_max,
        track.disc_number,
        track.disc_max,
        track.release_date,
        track.rating,
        track.original_track,
        track.memo,
        track.memo_manage,
        track.lyrics,
        string_order_cnv::cnv(&track.title),
        string_order_cnv::cnv(&track.artist),
        string_order_cnv::cnv(&track.album_artist),
        string_order_cnv::cnv(&track.album),
        string_order_cnv::cnv(&track.composer),
        string_order_cnv::cnv(&track.genre),
        track.suggest_target,
        track_id
    )
    .execute(&mut *tx)
    .await?;

    // 曲に紐付けるタグを更新
    sqlx::query!("DELETE FROM track_tags WHERE track_id = $1", track_id)
        .execute(&mut *tx)
        .await?;
    for tag_id in track.tag_ids {
        sqlx::query!(
            "INSERT INTO track_tags(track_id, tag_id) VALUES($1, $2)",
            track_id,
            tag_id
        )
        .execute(&mut *tx)
        .await?;
    }

    //プレイリストのリストアップ済みフラグ解除
    playlist_sqls::reset_listuped_flag(&mut tx).await?;

    tx.commit().await?;

    Ok(())
}

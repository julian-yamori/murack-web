use chrono::{DateTime, NaiveDate, Utc};
use murack_core_domain::{path::LibraryTrackPath, track::TrackDuration};
use sqlx::{PgTransaction, prelude::FromRow};

use crate::api_track_duration::ApiTrackDuration;

#[derive(Debug, PartialEq, Eq, FromRow)]
pub struct TrackRow {
    pub id: i32,

    pub path: LibraryTrackPath,
    pub duration: ApiTrackDuration,

    /// 曲の DB への追加日時
    pub created_at: DateTime<Utc>,

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
}

impl TrackRow {
    pub async fn from_db<'c>(tx: &mut PgTransaction<'c>, id: i32) -> sqlx::Result<Self> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT
                id,
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
                duration AS "duration: TrackDuration",
                created_at,
                rating,
                original_track,
                memo,
                memo_manage,
                lyrics,
                suggest_target,
                path AS "path: LibraryTrackPath"
            FROM tracks
            WHERE id = $1
            "#,
            id
        )
        .fetch_one(&mut **tx)
        .await
    }
}

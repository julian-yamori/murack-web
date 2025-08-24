use chrono::{DateTime, NaiveDate, Utc};
use murack_core_domain::path::LibraryTrackPath;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use utoipa::ToSchema;

use crate::{
    api_track_duration::ApiTrackDuration, tag::TagIdAndName, track_property::TrackArtwork,
};

/// 曲のプロパティ情報 (単曲プロパティ画面用)
#[derive(Debug, PartialEq, Eq, Serialize, Deserialize, ToSchema, FromRow)]
pub struct SingleTrackProperty {
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

    pub tags: Vec<TagIdAndName>,

    pub artworks: Vec<TrackArtwork>,
}

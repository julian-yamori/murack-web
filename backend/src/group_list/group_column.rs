use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// グループ選択で参照する曲データのカラム
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, ToSchema)]
pub enum GroupColumn {
    Genre,
    Artist,
    Album,
}

impl GroupColumn {
    /// tracks テーブルの値を示す列名を取得
    pub fn column_query(&self) -> &'static str {
        match self {
            Self::Genre => "genre",
            //アーティスト指定の場合は、アルバムアーティストが空欄でなければ使用する
            Self::Artist => "CASE album_artist WHEN '' THEN artist ELSE album_artist END",
            Self::Album => "album",
        }
    }

    /// ORDER BY 句で使用する列名を取得
    pub fn order_query(&self) -> &'static str {
        match self {
            Self::Genre => "genre_order",
            //アーティスト指定の場合は、アルバムアーティストが空欄でなければ使用する
            Self::Artist => {
                "CASE album_artist_order WHEN '' THEN artist_order ELSE album_artist_order END"
            }
            Self::Album => "album_order",
        }
    }
}

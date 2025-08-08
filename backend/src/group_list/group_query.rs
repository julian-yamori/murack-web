use murack_core_domain::db_utils::escs;
use serde::{Deserialize, Serialize};
use utoipa::IntoParams;

use crate::group_list::GroupColumn;

/// グループ選択による曲の検索条件
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, IntoParams)]
pub struct GroupQuery {
    #[param(value_type = Option<String>)]
    pub artist: GroupQueryValue,

    #[param(value_type = Option<String>)]
    pub album: GroupQueryValue,

    #[param(value_type = Option<String>)]
    pub genre: GroupQueryValue,
}

impl GroupQuery {
    /// この検索条件に該当する、`WHERE` の後ろに書く条件式を生成。
    ///
    /// 条件なし (全ての曲にマッチ) なら None
    pub fn where_query(&self) -> Option<String> {
        let mut queries = Vec::<String>::new();

        // ジャンルが指定されていれば条件に追加
        if let Some(genre) = &self.genre {
            queries.push(format!(
                "{} = {}",
                GroupColumn::Genre.column_query(),
                escs(genre)
            ));
        }

        // アーティストが指定されていれば条件に追加
        if let Some(artist) = &self.artist {
            queries.push(format!(
                "{} = {}",
                GroupColumn::Artist.column_query(),
                escs(artist)
            ));
        }

        // アルバムが指定されていれば条件に追加
        if let Some(album) = &self.album {
            queries.push(format!(
                "{} = {}",
                GroupColumn::Album.column_query(),
                escs(album)
            ));
        }

        if queries.is_empty() {
            None
        } else {
            Some(queries.join(" AND "))
        }
    }
}

/// 曲データと比較する値
///
/// 空文字列に一致する値を検索する場合は `Some(空文字列)` にする。
/// 「不明なアルバム」等を選択した場合にこの値になる。
///
/// 曲のどんな値ともマッチさせる場合は `None` にする。
/// 「全てのアルバム」等を選択したときにこの値になる。
pub type GroupQueryValue = Option<String>;

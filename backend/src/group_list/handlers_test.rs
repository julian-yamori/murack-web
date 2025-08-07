use axum::{
    Json,
    extract::{Query, State},
};
use sqlx::PgPool;

use super::handlers::{GroupListItem, get_album_list, get_artist_list, get_genre_list};
use crate::{error_handling::ApiResult, group_list::GroupQuery};

fn list_item(name: &str, artwork_id: Option<i32>) -> GroupListItem {
    GroupListItem {
        name: name.to_string(),
        artwork_id,
    }
}

mod test_get_genre_list {
    use super::*;

    /// ジャンル名取得の基本テスト
    /// - 空のデータベースでは空のリストが返る
    /// - 正常データでは期待通りのジャンルリストが返る（条件なし・ソート順確認）
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_empty"))]
    async fn 空のデータベース(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_genre_list(Query(query), State(pool)).await?;
        let Json(genres) = result;

        assert_eq!(genres, Vec::new());
        Ok(())
    }

    /// 正常データでのジャンル取得テスト
    /// - 条件なしで全ジャンル取得
    /// - genre_order でのソート確認
    /// - 重複データの DISTINCT 確認
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_normal"))]
    async fn 正常データ_条件なし(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_genre_list(Query(query), State(pool)).await?;
        let Json(genres) = result;

        // 期待するジャンルリスト（genre_order でソート済み）
        let expected = vec![list_item("Jazz", None), list_item("Rock", None)];
        assert_eq!(genres, expected);
        Ok(())
    }
}

mod test_get_artist_list {
    use super::*;

    /// アーティスト名取得の基本テスト
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_empty"))]
    async fn 空のデータベース(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_artist_list(Query(query), State(pool)).await?;
        let Json(artists) = result;

        assert_eq!(artists, Vec::new());
        Ok(())
    }

    /// 条件なしで全アーティスト取得
    /// - album_artist の条件付き処理確認
    /// - artist_order でのソート確認
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_normal"))]
    async fn 正常データ_条件なし(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_artist_list(Query(query), State(pool)).await?;
        let Json(artists) = result;

        // album_artist が空でない場合はそちらが使われる
        let expected = vec![
            list_item("Artist A", None),
            list_item("Artist B", None),
            list_item("Artist C", None),
        ];
        assert_eq!(artists, expected);
        Ok(())
    }

    /// ジャンル指定でのアーティスト取得
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_normal"))]
    async fn ジャンル指定フィルタ(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: Some("Rock".to_string()),
            artist: None,
            album: None,
        };

        let result = get_artist_list(Query(query), State(pool)).await?;
        let Json(artists) = result;

        // Rock ジャンルのアーティストのみ
        let expected = vec![list_item("Artist A", None), list_item("Artist B", None)];
        assert_eq!(artists, expected);
        Ok(())
    }
}

mod test_get_album_list {
    use super::*;

    /// アルバム名取得の基本テスト
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_empty"))]
    async fn 空のデータベース(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_album_list(Query(query), State(pool)).await?;
        let Json(albums) = result;

        assert_eq!(albums, Vec::new());
        Ok(())
    }

    /// 条件なしで全アルバム取得
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_normal"))]
    async fn 正常データ_条件なし(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_album_list(Query(query), State(pool)).await?;
        let Json(albums) = result;

        let expected = vec![
            list_item("Album 1", None),
            list_item("Album 1-A", None),
            list_item("Album 2", None),
            list_item("Album 3", None),
        ];
        assert_eq!(albums, expected);
        Ok(())
    }

    /// アーティスト指定でのアルバム取得
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_normal"))]
    async fn アーティスト指定フィルタ(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: Some("Artist A".to_string()),
            album: None,
        };

        let result = get_album_list(Query(query), State(pool)).await?;
        let Json(albums) = result;

        let expected = vec![list_item("Album 1", None), list_item("Album 1-A", None)];
        assert_eq!(albums, expected);
        Ok(())
    }

    /// ジャンル指定でのアルバム取得
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_normal"))]
    async fn ジャンル指定フィルタ(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: Some("Jazz".to_string()),
            artist: None,
            album: None,
        };

        let result = get_album_list(Query(query), State(pool)).await?;
        let Json(albums) = result;

        let expected = vec![list_item("Album 1-A", None), list_item("Album 2", None)];
        assert_eq!(albums, expected);
        Ok(())
    }

    /// ジャンル＋アーティスト指定でのアルバム取得
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_normal"))]
    async fn ジャンル_アーティスト指定フィルタ(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: Some("Rock".to_string()),
            artist: Some("Artist B".to_string()),
            album: None,
        };

        let result = get_album_list(Query(query), State(pool)).await?;
        let Json(albums) = result;

        let expected = vec![list_item("Album 3", None)];
        assert_eq!(albums, expected);
        Ok(())
    }
}

mod test_special_values {
    use super::*;

    /// 空文字列データの処理テスト
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_with_empty"))]
    async fn 空文字列データ処理(pool: PgPool) -> ApiResult<()> {
        // 空文字列のジャンルを検索
        let query = GroupQuery {
            genre: Some("".to_string()),
            artist: None,
            album: None,
        };

        let result = get_artist_list(Query(query), State(pool)).await?;
        let Json(artists) = result;

        // 空文字列ジャンルに対応するアーティスト
        let expected = vec![list_item("Unknown Artist", None)];
        assert_eq!(artists, expected);
        Ok(())
    }

    /// 重複データの DISTINCT 処理テスト
    #[sqlx::test(migrator = "crate::MIGRATOR", fixtures("test_group_list_duplicate"))]
    async fn 重複データ処理(pool: PgPool) -> ApiResult<()> {
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_genre_list(Query(query), State(pool)).await?;
        let Json(genres) = result;

        // 重複データがあっても DISTINCT で1つだけ
        let expected = vec![list_item("Rock", None)];
        assert_eq!(genres, expected);
        Ok(())
    }
}

mod test_order_alternate {
    use super::*;

    #[sqlx::test(
        migrator = "crate::MIGRATOR",
        fixtures("test_group_list_order_alternate")
    )]
    async fn ジャンル並び順(pool: PgPool) -> ApiResult<()> {
        // 全ての曲を検索
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_genre_list(Query(query), State(pool)).await?;
        let Json(artists) = result;

        // genre_order の順で取得する
        let expected = vec![
            list_item("ghr", None),
            list_item("DEF", None),
            list_item("abc", None),
        ];
        assert_eq!(artists, expected);
        Ok(())
    }

    #[sqlx::test(
        migrator = "crate::MIGRATOR",
        fixtures("test_group_list_order_alternate")
    )]
    async fn アーティスト並び順(pool: PgPool) -> ApiResult<()> {
        // 全ての曲を検索
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_artist_list(Query(query), State(pool)).await?;
        let Json(artists) = result;

        // album_order の順で取得する
        let expected = vec![
            list_item("ghr", None),
            list_item("DEF", None),
            list_item("abc", None),
        ];
        assert_eq!(artists, expected);
        Ok(())
    }

    #[sqlx::test(
        migrator = "crate::MIGRATOR",
        fixtures("test_group_list_order_alternate")
    )]
    async fn アルバム並び順(pool: PgPool) -> ApiResult<()> {
        // 全ての曲を検索
        let query = GroupQuery {
            genre: None,
            artist: None,
            album: None,
        };

        let result = get_album_list(Query(query), State(pool)).await?;
        let Json(artists) = result;

        // album_order の順で取得する
        let expected = vec![
            list_item("さしす", None),
            list_item("カキク", None),
            list_item("あいう", None),
        ];
        assert_eq!(artists, expected);
        Ok(())
    }
}

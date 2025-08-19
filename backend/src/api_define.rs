//! バックエンド API 定義と、ルーティング実装

use axum::{
    Router,
    routing::{get, put},
};
use murack_core_domain::SortType;
use utoipa::OpenApi;

use crate::{
    AppState, artwork, group_list::handlers as group_handlers,
    playlist::get_handlers as plist_gets, test_tag_group::handlers::*,
};

#[derive(OpenApi)]
#[openapi(
    paths(
        artwork::get_mini_artwork,
        group_handlers::get_genre_list,
        group_handlers::get_artist_list,
        group_handlers::get_album_list,
        group_handlers::get_track_list,
        plist_gets::get_playlist_list,
        plist_gets::get_playlist_details,
        plist_gets::get_playlist_tracks,
        get_tag_groups,
        create_tag_group,
        update_tag_group,
        delete_tag_group
    ),
    components(schemas(SortType))
)]
pub struct ApiDoc;

pub fn api_routing(mut router: Router<AppState>) -> Router<AppState> {
    // artworks
    router = router.route("/api/artworks/{id}/mini", get(artwork::get_mini_artwork));

    // group_list
    router = router
        .route(
            "/api/group_list/genre_list",
            get(group_handlers::get_genre_list),
        )
        .route(
            "/api/group_list/artist_list",
            get(group_handlers::get_artist_list),
        )
        .route(
            "/api/group_list/album_list",
            get(group_handlers::get_album_list),
        )
        .route(
            "/api/group_list/track_list",
            get(group_handlers::get_track_list),
        );

    // playlists
    router = router
        .route("/api/playlists/list", get(plist_gets::get_playlist_list))
        .route("/api/playlists/{id}", get(plist_gets::get_playlist_details))
        .route(
            "/api/playlists/{id}/tracks",
            get(plist_gets::get_playlist_tracks),
        );

    // tag_groups (プロトタイプ用)
    router = router
        .route(
            "/api/tag_groups",
            get(get_tag_groups).post(create_tag_group),
        )
        .route(
            "/api/tag_groups/{id}",
            put(update_tag_group).delete(delete_tag_group),
        );

    router
}

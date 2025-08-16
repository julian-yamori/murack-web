mod artwork;
mod database;
mod error_handling;
mod group_list;
mod playlist;
mod test_tag_group;
mod track_list;

use std::env;

use axum::{
    Router, middleware,
    routing::{get, put},
};
use murack_core_domain::SortType;
use tower_http::cors::{Any, CorsLayer};
use utoipa::OpenApi;

use crate::{
    error_handling::error_handler_middleware, group_list::handlers as group_handlers,
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
        get_tag_groups,
        create_tag_group,
        update_tag_group,
        delete_tag_group
    ),
    components(schemas(SortType))
)]
struct ApiDoc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 引数で --apidoc が指定された場合、stdout に出力だけして終了
    if let Some("--apidoc") = env::args().nth(1).as_deref() {
        println!("{}", ApiDoc::openapi().to_json()?);
        return Ok(());
    }

    // Load environment variables
    dotenvy::dotenv().ok();

    // Initialize database
    let database_url = env::var("DATABASE_URL")?;
    let pool = database::create_pool(&database_url).await?;
    // 接続に問題があれば早期終了する
    database::test_connection(&pool).await?;

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build our application with routes
    let app = Router::new()
        .route("/api/artworks/{id}/mini", get(artwork::get_mini_artwork))
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
        )
        .route("/api/playlists/list", get(plist_gets::get_playlist_list))
        .route("/api/playlists/{id}", get(plist_gets::get_playlist_details))
        .route(
            "/api/tag_groups",
            get(get_tag_groups).post(create_tag_group),
        )
        .route(
            "/api/tag_groups/{id}",
            put(update_tag_group).delete(delete_tag_group),
        )
        .layer(middleware::from_fn(error_handler_middleware))
        .layer(cors)
        .with_state(pool);

    // Get port from environment or use default
    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{port}");

    println!("🚀 Server starting on http://{addr}");

    // Start server
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

#[cfg(test)]
pub static MIGRATOR: sqlx::migrate::Migrator = sqlx::migrate!("../../murack-core/migrations");

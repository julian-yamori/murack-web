use axum::{
    Router,
    response::Json,
    routing::{get, put},
};
use std::env;
use tower_http::cors::{Any, CorsLayer};
use utoipa::OpenApi;

mod database;
mod handlers;
mod models;

use handlers::*;
use models::*;

#[derive(OpenApi)]
#[openapi(
    paths(
        handlers::get_songs,
        handlers::create_song,
        handlers::update_song,
        handlers::delete_song,
    ),
    components(
        schemas(Song, CreateSongRequest, UpdateSongRequest)
    ),
    tags(
        (name = "songs", description = "Song management API")
    )
)]
struct ApiDoc;

async fn serve_openapi_spec() -> Json<utoipa::openapi::OpenApi> {
    Json(ApiDoc::openapi())
}

#[tokio::main]
async fn main() -> Result<(), MainError> {
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
        .route("/api/songs", get(get_songs).post(create_song))
        .route("/api/songs/{id}", put(update_song).delete(delete_song))
        .route("/api/docs/openapi.json", get(serve_openapi_spec))
        .layer(cors)
        .with_state(pool);

    // Get port from environment or use default
    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{port}");

    println!("🚀 Server starting on http://{addr}");
    println!("📚 API documentation available at http://{addr}/api/docs/openapi.json");

    // Start server
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

// main 関数用のエラー型
#[derive(thiserror::Error, Debug)]
enum MainError {
    #[error(transparent)]
    Env(#[from] std::env::VarError),

    #[error(transparent)]
    Db(#[from] sqlx::Error),

    #[error(transparent)]
    Io(#[from] std::io::Error),
}

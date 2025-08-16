mod api_define;
mod artwork;
mod database;
mod error_handling;
mod group_list;
mod playlist;
mod test_tag_group;
mod track_list;

use std::env;

use axum::{Router, middleware};
use sqlx::PgPool;
use tower_http::cors::{Any, CorsLayer};
use utoipa::OpenApi;

use crate::{api_define::ApiDoc, error_handling::error_handler_middleware};

type AppState = PgPool;

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
    let app = api_define::api_routing(Router::new())
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

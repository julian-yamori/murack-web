use sqlx::{PgPool, Row};

pub async fn create_pool(database_url: &str) -> sqlx::Result<PgPool> {
    let pool = PgPool::connect(database_url).await?;

    Ok(pool)
}

/// アプリ起動時の疎通確認
pub async fn test_connection(pool: &PgPool) -> sqlx::Result<()> {
    let row = sqlx::query("SELECT 1 as test").fetch_one(pool).await?;

    let test_value: i32 = row.get("test");
    println!("Database connection test: {test_value}");

    Ok(())
}

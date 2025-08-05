use anyhow::anyhow;
use axum::{
    http::{Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};

/// handler で使用するエラー値
#[derive(Debug)]
pub struct ApiError(anyhow::Error);

impl ApiError {
    /// 副作用のための SQL の実行結果が `rows_affected() == 0` だった時のエラーを生成する
    pub fn no_rows_affected() -> Self {
        Self(anyhow!("no rows affected"))
    }
}

// This enables using `?` on functions that return `Result<_, anyhow::Error>` to turn them into
// `Result<_, ApiError>`. That way you don't need to do that manually.
impl<E> From<E> for ApiError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let mut response = StatusCode::INTERNAL_SERVER_ERROR.into_response();

        // エラーメッセージを extentions に追加
        let error_message = self.0.to_string();
        response.extensions_mut().insert(error_message);

        response
    }
}

pub type ApiResult<T> = Result<T, ApiError>;

/// エラーハンドリング middleware
/// handler でエラーが発生した場合、stderr にログ出力してからクライアントにレスポンスを返す
pub async fn error_handler_middleware(request: Request<axum::body::Body>, next: Next) -> Response {
    let method = request.method().clone();
    let uri = request.uri().clone();

    let response = next.run(request).await;

    // ステータスコードが 500 の場合は ApiError を想定し、エラーログを出力
    if response.status() == StatusCode::INTERNAL_SERVER_ERROR {
        eprintln!("500 Internal Server Error: {method} {uri}");
        if let Some(error_message) = response.extensions().get::<String>() {
            eprintln!("{error_message}");
        }
    }

    response
}

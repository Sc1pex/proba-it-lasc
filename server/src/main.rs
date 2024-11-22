use anyhow::Result;
use axum::{routing::get, Router};
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().unwrap_or_default();
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let router = Router::new()
        .route("/", get(|| async { "Hello world" }))
        .layer(TraceLayer::new_for_http());

    let listener = TcpListener::bind("localhost:8090").await?;
    axum::serve(listener, router).await.map_err(Into::into)
}

use anyhow::Result;
use db::Db;
use tracing_subscriber::EnvFilter;

mod api;
mod db;

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().unwrap_or_default();
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let db_url = std::env::var("DATABASE_URL").expect("no DATABASE_URL given");
    let db = Db::new(&db_url).await;
    db.spawn_session_remover_task();

    api::serve("localhost:8090", api::AppState::new(db)).await
}

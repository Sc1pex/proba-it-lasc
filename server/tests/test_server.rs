use server::api::AppState;
use sqlx::{Connection, PgConnection};
use tracing_subscriber::EnvFilter;

pub struct TestServer {
    _db: TestDb,
    pub server: axum_test::TestServer,
}

impl TestServer {
    pub async fn new() -> Self {
        dotenvy::dotenv().unwrap_or_default();
        let _ = tracing_subscriber::fmt()
            .with_env_filter(EnvFilter::from_default_env())
            .try_init();

        let db = TestDb::new().await;
        let router = server::api::router().with_state(AppState::new(db.db.clone()));
        let server = axum_test::TestServer::new(router).unwrap();

        Self { _db: db, server }
    }
}

pub struct TestDb {
    url: String,
    db: server::db::Db,
}

impl TestDb {
    pub async fn new() -> Self {
        use rand::distributions::Alphanumeric;
        use rand::{thread_rng, Rng};

        let mut db_url = std::env::var("DATABASE_URL").expect("no DATABASE_URL given");
        let rng = thread_rng();
        let suffix: String = rng
            .sample_iter(&Alphanumeric)
            .take(16)
            .map(char::from)
            .collect();

        db_url = format!("{}_{}", db_url, suffix);

        create_db(&db_url).await;

        Self {
            db: server::db::Db::new(&db_url).await,
            url: db_url,
        }
    }
}

impl Drop for TestDb {
    fn drop(&mut self) {
        tokio::task::block_in_place(|| {
            tokio::runtime::Handle::current().block_on(async move {
                self.db.close().await;
                drop_db(&self.url).await;
            })
        });
    }
}

async fn create_db(url: &str) {
    let (pg_server, name) = url.rsplit_once("/").unwrap();
    let mut conn = PgConnection::connect(pg_server).await.unwrap();

    sqlx::query(&format!(r#"CREATE DATABASE "{}""#, &name))
        .execute(&mut conn)
        .await
        .unwrap();
}

async fn drop_db(url: &str) {
    let (pg_server, name) = url.rsplit_once("/").unwrap();
    let mut conn = PgConnection::connect(pg_server).await.unwrap();

    sqlx::query(&format!(r#"DROP DATABASE "{}" (FORCE)"#, &name))
        .execute(&mut conn)
        .await
        .unwrap();
}

use anyhow::Result;
use sqlx::{postgres::PgPoolOptions, query, PgPool};
use uuid::Uuid;

#[derive(Clone)]
pub struct Db(PgPool);

impl Db {
    pub async fn new() -> Self {
        let db_url = std::env::var("DATABASE_URL").expect("no DATABASE_URL given");
        let db = PgPoolOptions::new()
            .connect(&db_url)
            .await
            .expect("Failed to connect to db");

        sqlx::migrate!()
            .run(&db)
            .await
            .expect("Failed to run migrations on db");

        Self(db)
    }

    pub async fn exists_user_with_mail(&self, email: &str) -> Result<bool> {
        query!("SELECT id FROM Users WHERE email = $1", email)
            .fetch_optional(&self.0)
            .await
            .map(|r| r.is_some())
            .map_err(Into::into)
    }

    pub async fn create_user(
        &self,
        name: &str,
        phone: &str,
        email: &str,
        password_hash: &str,
    ) -> Result<Uuid> {
        query!(
            r#"INSERT INTO Users(name, phone, email, password_hash) 
            VALUES ($1, $2, $3, $4) RETURNING id"#,
            name,
            phone,
            email,
            password_hash
        )
        .fetch_one(&self.0)
        .await
        .map(|r| r.id)
        .map_err(Into::into)
    }
}

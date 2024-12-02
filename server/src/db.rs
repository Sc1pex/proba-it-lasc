use anyhow::Result;
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, query, query_as, PgPool};
use std::time::Duration;
use uuid::Uuid;

#[derive(Clone)]
pub struct Db(PgPool);

impl Db {
    pub async fn new(db_url: &str) -> Self {
        let db = PgPoolOptions::new()
            .connect(db_url)
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

    pub async fn create_user_session(&self, user_id: &Uuid) -> Result<Uuid> {
        query!(
            r#"INSERT INTO UserSessions(user_id) VALUES ($1) RETURNING session_id"#,
            user_id
        )
        .fetch_one(&self.0)
        .await
        .map(|r| r.session_id)
        .map_err(Into::into)
    }

    pub async fn get_session_from_id(&self, session_id: &Uuid) -> Result<Option<UserSession>> {
        query_as!(
            UserSession,
            r#"SELECT session_id, user_id FROM UserSessions WHERE session_id = $1"#,
            session_id
        )
        .fetch_optional(&self.0)
        .await
        .map_err(Into::into)
    }

    pub async fn get_session_from_user(&self, user_id: &Uuid) -> Result<Option<UserSession>> {
        query_as!(
            UserSession,
            r#"SELECT session_id, user_id FROM UserSessions WHERE user_id = $1"#,
            user_id
        )
        .fetch_optional(&self.0)
        .await
        .map_err(Into::into)
    }

    pub async fn get_user_from_id(&self, user_id: &Uuid) -> Result<User> {
        query_as!(User, r#"SELECT * FROM Users WHERE id = $1"#, user_id)
            .fetch_one(&self.0)
            .await
            .map_err(Into::into)
    }

    pub async fn get_user_from_email(&self, email: &str) -> Result<Option<User>> {
        query_as!(User, r#"SELECT * FROM Users WHERE email = $1"#, email)
            .fetch_optional(&self.0)
            .await
            .map_err(Into::into)
    }

    pub fn spawn_session_remover_task(&self) {
        let pool = self.0.clone();
        tokio::spawn(async move {
            loop {
                query!("DELETE FROM UserSessions WHERE created_at < NOW() - interval '30 days'")
                    .execute(&pool)
                    .await
                    .expect("Failed to run old session remover");

                tokio::time::sleep(Duration::from_secs(60 * 60)).await;
            }
        });
    }

    #[allow(dead_code)]
    pub async fn close(&self) {
        self.0.close().await;
    }
}

impl Db {
    pub async fn new_recipe(
        &self,
        name: &str,
        description: &str,
        image_data: &[u8],
        author_id: &Uuid,
    ) -> Result<()> {
        query!(
            "INSERT INTO Recipes(name, description, image, author_id) VALUES ($1, $2, $3, $4)",
            name,
            description,
            image_data,
            author_id
        )
        .execute(&self.0)
        .await
        .map_err(Into::into)
        .map(|_| ())
    }

    pub async fn get_recipe_image(&self, image_id: Uuid) -> Result<Option<Vec<u8>>> {
        query!("SELECT image FROM Recipes WHERE id = $1", image_id)
            .fetch_optional(&self.0)
            .await
            .map_err(Into::into)
            .map(|r| r.map(|r| r.image))
    }

    pub async fn get_recipes(&self) -> Result<Vec<Recipe>> {
        query_as!(Recipe, r#"SELECT r.name, r.description, r.id, u.name as "author!" FROM Recipes as r LEFT JOIN Users as u ON u.id = r.author_id"#)
            .fetch_all(&self.0)
            .await
            .map_err(Into::into)
    }
}

impl Db {
    pub async fn new_contact(&self, c: ContactForm) -> Result<()> {
        query!(
            "INSERT INTO ContactForm(first_name, last_name, email, message) VALUES ($1, $2, $3, $4)",
            c.first_name,
            c.last_name,
            c.email,
            c.message,
        )
        .execute(&self.0)
        .await
        .map_err(Into::into)
        .map(|_| ())
    }

    pub async fn get_contacts(&self) -> Result<Vec<ContactForm>> {
        query_as!(
            ContactForm,
            r#"SELECT first_name, last_name, email, message FROM ContactForm"#
        )
        .fetch_all(&self.0)
        .await
        .map_err(Into::into)
    }
}

#[derive(Serialize, Deserialize)]
pub struct ContactForm {
    first_name: String,
    last_name: String,
    email: String,
    message: String,
}

#[derive(Serialize)]
pub struct Recipe {
    pub name: String,
    pub description: String,
    pub id: Uuid,
    pub author: String,
}

pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub password_hash: String,
}

pub struct UserSession {
    pub session_id: Uuid,
    pub user_id: Uuid,
}

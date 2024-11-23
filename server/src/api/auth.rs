use super::*;
use anyhow::{anyhow, Result};
use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHasher,
};
use axum::extract::{self, State};
use serde::Deserialize;
use tracing::info;

#[derive(Deserialize)]
pub struct LoginRequest {}

pub async fn login() -> ApiResult<()> {
    todo!()
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    name: String,
    phone: String,
    email: String,
    password: String,
}

pub async fn register(
    State(state): State<AppState>,
    extract::Json(register): extract::Json<RegisterRequest>,
) -> ApiResult<()> {
    let mut errors = HashMap::new();

    if let Err(pass_err) = validate_password(&register.password) {
        errors.insert("password".into(), pass_err);
    }

    if state.db.exists_user_with_mail(&register.email).await? {
        errors.insert(
            "email".into(),
            "User with that email address already exists".into(),
        );
    }

    let password_hash = hash_password(&register.password)?;
    let user_id = state
        .db
        .create_user(
            &register.name,
            &register.phone,
            &register.email,
            &password_hash,
        )
        .await?;

    info!("Created user with id {}", user_id);

    if errors.len() != 0 {
        Err(ApiError::InvalidFields(errors))
    } else {
        Ok(())
    }
}

fn validate_password(password: &str) -> Result<(), String> {
    if password.len() < 8 {
        return Err("Password must be at least 8 characters long".into());
    }

    Ok(())
}

fn hash_password(password: &str) -> Result<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|_| anyhow!("failed to hash password"))?;
    Ok(hash.to_string())
}

use super::*;
use anyhow::{anyhow, Result};
use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHasher,
};
use axum::extract::{self, State};
use axum_extra::extract::{
    cookie::{Cookie, SameSite},
    CookieJar,
};
use serde::Deserialize;
use time::Duration;

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
) -> ApiResult<CookieJar> {
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

    if errors.len() != 0 {
        return Err(ApiError::InvalidFields(errors));
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

    let session_id = state.db.create_user_session(&user_id).await?;
    let cookie = Cookie::build(("session_id", session_id.to_string()))
        .max_age(Duration::days(30))
        .same_site(SameSite::Lax);

    Ok(CookieJar::new().add(cookie))
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

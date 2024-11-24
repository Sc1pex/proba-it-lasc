use super::*;
use anyhow::{anyhow, Result};
use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
};
use axum::extract::{self, State};
use axum_extra::extract::{
    cookie::{Cookie, SameSite},
    CookieJar,
};
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use time::Duration;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct LoginRequest {
    email: String,
    password: String,
}

pub async fn login(
    State(state): State<AppState>,
    extract::Json(login): extract::Json<LoginRequest>,
) -> ApiResult<CookieJar> {
    let user = if let Some(user) = state.db.get_user_from_email(&login.email).await? {
        user
    } else {
        return Err(ApiError::InvalidFields(
            [(
                "email".to_string(),
                "User with that email dosen't exist".to_string(),
            )]
            .into(),
        ));
    };

    if let Err(pass_err) = valid_password(&login.password) {
        return Err(ApiError::InvalidFields(
            [("password".to_string(), pass_err)].into(),
        ));
    }

    if !correct_password(&user.password_hash, &login.password)? {
        return Err(ApiError::InvalidFields(
            [("password".to_string(), "Wrong password".to_string())].into(),
        ));
    }

    let session_id = if let Some(s) = state.db.get_session_from_user(&user.id).await? {
        s.session_id
    } else {
        state.db.create_user_session(&user.id).await?
    };
    Ok(CookieJar::new().add(session_cookie(session_id)))
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

    if let Err(pass_err) = valid_password(&register.password) {
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
    Ok(CookieJar::new().add(session_cookie(session_id)))
}

#[derive(Serialize)]
struct GetUserResponse {
    name: String,
}

pub async fn get_user(
    State(state): State<AppState>,
    cookies: CookieJar,
) -> ApiResult<impl IntoResponse> {
    let session_id = if let Some(s) = cookies.get("session_id") {
        s.value()
    } else {
        return Ok(Json(json!({})).into_response());
    };
    let session_id = Uuid::from_str(session_id)?;

    let session = if let Some(s) = state.db.get_session_from_id(&session_id).await? {
        s
    } else {
        return invalid_data("Invalid cookie. Please logout and login again");
    };
    // TODO: check if session is older than 30 days

    let user = state.db.get_user_from_id(&session.user_id).await?;
    let resp = GetUserResponse { name: user.name };

    Ok(Json(resp).into_response())
}

fn session_cookie<'a>(session_id: Uuid) -> impl Into<Cookie<'a>> {
    Cookie::build(("session_id", session_id.to_string()))
        .max_age(Duration::days(30))
        .http_only(true)
        .same_site(SameSite::Lax)
}

fn valid_password(password: &str) -> Result<(), String> {
    if password.len() < 8 {
        return Err("Password must be at least 8 characters long".into());
    }

    Ok(())
}

fn correct_password(password_hash: &str, password: &str) -> Result<bool> {
    let parsed_hash = PasswordHash::new(&password_hash)
        .map_err(|_| anyhow!("invalid password hash stored in db"))?;
    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}

fn hash_password(password: &str) -> Result<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|_| anyhow!("failed to hash password"))?;
    Ok(hash.to_string())
}

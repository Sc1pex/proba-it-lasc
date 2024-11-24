use crate::db::Db;
use anyhow::Result;
use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde_json::json;
use std::collections::HashMap;
use tokio::net::{TcpListener, ToSocketAddrs};
use tower_http::{cors::CorsLayer, trace::TraceLayer};

mod auth;

#[derive(Clone)]
pub struct AppState {
    db: Db,
}

impl AppState {
    pub fn new(db: Db) -> Self {
        Self { db }
    }
}

pub async fn serve<A: ToSocketAddrs>(addr: A, state: AppState) -> Result<()> {
    let listener = TcpListener::bind(addr).await?;
    axum::serve(listener, router().with_state(state))
        .await
        .map_err(Into::into)
}

fn router() -> Router<AppState> {
    Router::new()
        .route("/login", post(auth::login))
        .route("/register", post(auth::register))
        .route("/user", get(auth::get_user))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::very_permissive())
}

type ApiResult<T> = Result<T, ApiError>;

#[derive(Debug)]
enum ApiError {
    InvalidData(String),
    InvalidFields(HashMap<String, String>),

    #[allow(dead_code)]
    Unknown(anyhow::Error),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        tracing::error!("API error: {:?}", self);

        match self {
            ApiError::InvalidData(s) => {
                (StatusCode::BAD_REQUEST, Json(json!({"err": s}))).into_response()
            }
            ApiError::InvalidFields(f) => (StatusCode::OK, Json(f)).into_response(),
            ApiError::Unknown(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"err": "internal server error"})),
            )
                .into_response(),
        }
    }
}

fn invalid_data<T>(err: impl ToString) -> ApiResult<T> {
    Err(ApiError::InvalidData(err.to_string()))
}

impl<T> From<T> for ApiError
where
    T: Into<anyhow::Error>,
{
    fn from(err: T) -> Self {
        let err: anyhow::Error = err.into();
        Self::Unknown(err)
    }
}

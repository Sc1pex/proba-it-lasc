use std::collections::HashMap;

use crate::db::Db;
use anyhow::Result;
use axum::{http::StatusCode, response::IntoResponse, routing::get, Json, Router};
use serde_json::json;
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
        .route("/login", get(auth::login))
        .route("/register", get(auth::register))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
}

type ApiResult<T> = Result<T, ApiError>;

#[derive(Debug)]
enum ApiError {
    InvalidFields(HashMap<String, String>),

    #[allow(dead_code)]
    Unknown(anyhow::Error),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        tracing::error!("API error: {:?}", self);

        match self {
            ApiError::InvalidFields(f) => (StatusCode::BAD_REQUEST, Json(f)).into_response(),
            ApiError::Unknown(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"err": "internal server error"})),
            )
                .into_response(),
        }
    }
}

impl From<anyhow::Error> for ApiError {
    fn from(err: anyhow::Error) -> Self {
        Self::Unknown(err)
    }
}

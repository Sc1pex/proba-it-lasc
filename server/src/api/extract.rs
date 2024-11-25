use super::{ApiResult, AppState};
use crate::api::auth::SESSION_COOKIE;
use axum::{async_trait, extract::FromRequestParts, http::request::Parts, Json};
use axum_extra::extract::CookieJar;
use serde::Serialize;
use serde_json::{json, Value};
use std::str::FromStr;
use uuid::Uuid;

#[derive(Serialize)]
pub struct ExtractUser {
    pub name: String,
    pub email: String,
    pub phone: String,
}

#[async_trait]
impl FromRequestParts<AppState> for ExtractUser {
    type Rejection = ApiResult<Json<Value>>;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let cookies = CookieJar::from_request_parts(parts, state)
            .await
            .map_err(|_| Ok(Json(json!({}))))?;

        let session_id = if let Some(s) = cookies.get(SESSION_COOKIE) {
            s.value()
        } else {
            return Err(Ok(Json(json!({}))));
        };
        let session_id = Uuid::from_str(session_id).map_err(|e| Err(e.into()))?;

        let session = if let Some(s) = state
            .db
            .get_session_from_id(&session_id)
            .await
            .map_err(|e| Err(e.into()))?
        {
            s
        } else {
            return Err(Ok(Json(json!({}))));
        };

        let user = state
            .db
            .get_user_from_id(&session.user_id)
            .await
            .map_err(|e| Err(e.into()))?;

        Ok(Self {
            name: user.name,
            email: user.email,
            phone: user.phone,
        })
    }
}

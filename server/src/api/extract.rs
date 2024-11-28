use super::{ApiError, ApiResult, AppState};
use crate::api::{auth::SESSION_COOKIE, invalid_req};
use axum::{
    async_trait,
    extract::{FromRequest, FromRequestParts, Request},
    http::request::Parts,
    Json,
};
use axum_extra::extract::{CookieJar, Multipart};
use serde::Serialize;
use serde_json::{json, Value};
use std::str::FromStr;
use uuid::Uuid;

#[derive(Serialize)]
pub struct ExtractUser {
    pub id: Uuid,
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
            id: session.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        })
    }
}

#[derive(Serialize)]
pub struct NewRecipeExtractor {
    pub name: String,
    pub description: String,
    pub image: Vec<u8>,
}

#[async_trait]
impl<S> FromRequest<S> for NewRecipeExtractor
where
    S: Send + Sync,
{
    type Rejection = ApiError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let mut multipart = Multipart::from_request(req, state)
            .await
            .map_err(|_| ApiError::InvalidRequest("not a multipart/form-data request".into()))?;

        let mut name = None;
        let mut descr = None;
        let mut image = None;
        while let Some(field) = multipart.next_field().await.unwrap() {
            let field_name = field.name().unwrap().to_string();
            match field_name.as_str() {
                "name" => name = Some(field.text().await?),
                "description" => descr = Some(field.text().await?),
                "image" => image = Some(field.bytes().await?),
                _ => return Err(invalid_req(format!("Unexpected field {}", field_name))),
            }
        }

        let image = image.and_then(|b| {
            if infer::image::is_png(&b) || infer::image::is_jpeg(&b) {
                Some(b.to_vec())
            } else {
                None
            }
        });

        Ok(Self {
            name: name.ok_or_else(|| invalid_req("Expected name field"))?,
            description: descr.ok_or_else(|| invalid_req("Expected description field"))?,
            image: image.ok_or_else(|| invalid_req("Expected valid image field"))?,
        })
    }
}

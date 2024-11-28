use super::*;
use axum::{body::Body, extract::State, http::header};
use extract::{ExtractUser, NewRecipeExtractor};
use serde::Deserialize;
use uuid::Uuid;

pub async fn add_recipe(
    State(state): State<AppState>,
    user: ExtractUser,
    req: NewRecipeExtractor,
) -> ApiResult<()> {
    state
        .db
        .new_recipe(&req.name, &req.description, &req.image, &user.id)
        .await?;

    Ok(())
}

#[derive(Deserialize)]
pub struct GetRecipeImageRequest {
    id: Uuid,
}

#[axum::debug_handler]
pub async fn get_recipe_imgage(
    State(state): State<AppState>,
    Json(req): Json<GetRecipeImageRequest>,
) -> ApiResult<impl IntoResponse> {
    let image = state
        .db
        .get_recipe_image(req.id)
        .await?
        .ok_or(invalid_req("invalid recipe id"))?;

    let mime_type = infer::get(&image)
        .expect("There can't be an invalid image in the db")
        .mime_type();

    let headers = [(header::CONTENT_TYPE, mime_type)];
    Ok((headers, Body::from(image)))
}

use crate::db::Recipe;

use super::*;
use axum::{
    body::Body,
    extract::{Path, State},
    http::header,
};
use extract::{ExtractUser, NewRecipeExtractor};
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

pub async fn get_recipe_imgage(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> ApiResult<impl IntoResponse> {
    let image = state
        .db
        .get_recipe_image(id)
        .await?
        .ok_or(invalid_req("invalid recipe id"))?;

    let mime_type = infer::get(&image)
        .expect("There can't be an invalid image in the db")
        .mime_type();

    let headers = [(header::CONTENT_TYPE, mime_type)];
    Ok((headers, Body::from(image)))
}

pub async fn get_recipes(State(state): State<AppState>) -> ApiResult<Json<Vec<Recipe>>> {
    Ok(Json::from(state.db.get_recipes().await?))
}

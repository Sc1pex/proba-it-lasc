use super::*;
use axum::extract::{Path, State};
use extract::ExtractUser;
use serde::Deserialize;
use uuid::Uuid;

pub async fn get_user_rating(
    State(state): State<AppState>,
    user: ExtractUser,
    Path(recipe_id): Path<Uuid>,
) -> ApiResult<String> {
    Ok(state
        .db
        .user_rating(&user.id, &recipe_id)
        .await?
        .unwrap_or(0)
        .to_string())
}

#[derive(Deserialize)]
pub struct RateRequest {
    recipe_id: Uuid,
    rating: i32,
}

pub async fn rate_recipe(
    State(state): State<AppState>,
    user: ExtractUser,
    Json(req): Json<RateRequest>,
) -> ApiResult<()> {
    let cur_rating = state.db.user_rating(&user.id, &req.recipe_id).await?;

    if let Some(r) = cur_rating {
        state
            .db
            .update_rating(&req.recipe_id, &user.id, r, req.rating)
            .await?;
    } else {
        state
            .db
            .add_rating(&req.recipe_id, &user.id, req.rating)
            .await?;
    }

    Ok(())
}

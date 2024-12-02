use super::*;
use crate::db::ContactForm;
use axum::extract::State;

pub async fn new_contact(
    State(state): State<AppState>,
    Json(req): Json<ContactForm>,
) -> ApiResult<()> {
    state.db.new_contact(req).await.map_err(Into::into)
}

pub async fn view_contacts(State(state): State<AppState>) -> ApiResult<Json<Vec<ContactForm>>> {
    Ok(Json::from(state.db.get_contacts().await?))
}

use axum::routing::{delete, get, patch, post};
use axum::Router;
use std::sync::Arc;

use crate::handlers::workspace;
use crate::AppState;

pub fn build_workspace_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/api/workspaces", get(workspace::list_workspaces))
        .route("/api/workspaces", post(workspace::create_workspace))
        .route(
            "/api/workspaces/{slug}",
            get(workspace::get_workspace_by_slug),
        )
        .route(
            "/api/workspaces/{id}",
            patch(workspace::update_workspace),
        )
        .route(
            "/api/workspaces/{id}",
            delete(workspace::delete_workspace),
        )
}

use std::sync::Arc;

use axum::extract::State;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

use crate::db::entities::workspaces;
use crate::db::repos::workspace_repo::WorkspaceRepo;
use crate::error::{ApiResponse, AppError};
use crate::handlers::auth::AuthUser;
use crate::AppState;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceOutput {
    pub id: String,
    pub slug: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
}

impl From<workspaces::Model> for WorkspaceOutput {
    fn from(w: workspaces::Model) -> Self {
        Self {
            id: w.id.to_string(),
            slug: w.slug,
            name: w.name,
            description: w.description,
            created_at: w
                .created_at
                .map(|dt| dt.to_rfc3339())
                .unwrap_or_default(),
        }
    }
}

pub async fn list_workspaces(
    State(state): State<Arc<AppState>>,
    auth_user: AuthUser,
) -> Response {
    // In single workspace mode, ensure user has access to the shared workspace
    {
        use crate::db::entities::system_settings;
        use crate::db::entities::workspace_members::WorkspaceMemberRole;
        use crate::handlers::auth::settings::resolve_single_workspace_mode;
        use sea_orm::EntityTrait;

        let row = system_settings::Entity::find()
            .one(&state.db)
            .await
            .ok()
            .flatten();
        let db_value = row.map(|s| s.single_workspace_mode).unwrap_or(false);
        let (effective, _) = resolve_single_workspace_mode(db_value);

        if effective {
            // Auto-provision: ensure shared workspace exists and user is a member
            match WorkspaceRepo::get_or_create_shared(&state.db, &auth_user.user_id).await {
                Ok(shared_ws) => {
                    let _ = WorkspaceRepo::add_member(
                        &state.db,
                        &shared_ws.id,
                        &auth_user.user_id,
                        WorkspaceMemberRole::Member,
                    )
                    .await;
                }
                Err(e) => return e.into_response(),
            }
        }
    }

    let workspaces = match WorkspaceRepo::list_by_user(&state.db, &auth_user.user_id).await {
        Ok(ws) => ws,
        Err(e) => return e.into_response(),
    };

    let output: Vec<WorkspaceOutput> = workspaces.into_iter().map(WorkspaceOutput::from).collect();

    Json(ApiResponse {
        success: true,
        data: Some(output),
        error: None,
    })
    .into_response()
}

#[derive(serde::Deserialize)]
pub struct CreateWorkspaceInput {
    pub name: String,
    pub slug: Option<String>,
}

pub async fn create_workspace(
    State(state): State<Arc<AppState>>,
    auth_user: AuthUser,
    Json(body): Json<CreateWorkspaceInput>,
) -> Response {
    // Block workspace creation in single workspace mode
    {
        use crate::db::entities::system_settings;
        use crate::handlers::auth::settings::resolve_single_workspace_mode;
        use sea_orm::EntityTrait;

        let row = system_settings::Entity::find()
            .one(&state.db)
            .await
            .ok()
            .flatten();
        let db_value = row.map(|s| s.single_workspace_mode).unwrap_or(false);
        let (effective, _) = resolve_single_workspace_mode(db_value);
        if effective {
            return AppError::BadRequest(
                "Cannot create workspaces in single workspace mode".into(),
            )
            .into_response();
        }
    }

    let slug = body.slug.unwrap_or_else(|| {
        body.name
            .to_lowercase()
            .replace(' ', "-")
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == '-')
            .collect()
    });

    let ws = match WorkspaceRepo::create_with_owner(&state.db, &body.name, &slug, &auth_user.user_id)
        .await
    {
        Ok(ws) => ws,
        Err(e) => {
            if e.to_string().contains("duplicate") || e.to_string().contains("unique") {
                return AppError::Conflict("workspace slug already exists".into()).into_response();
            }
            return e.into_response();
        }
    };

    Json(ApiResponse {
        success: true,
        data: Some(WorkspaceOutput::from(ws)),
        error: None,
    })
    .into_response()
}

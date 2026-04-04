use std::sync::Arc;

use axum::extract::State;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Deserialize;

use crate::db::entities::users::UserRole;
use crate::db::entities::workspace_members::WorkspaceMemberRole;
use crate::db::repos::auth_repo::AuthRepo;
use crate::db::repos::workspace_repo::WorkspaceRepo;
use crate::error::AppError;
use crate::services::auth::hash_password;
use crate::AppState;

use super::login::{build_session_response, AuthOutput, UserDto};
use super::settings::resolve_single_workspace_mode;

#[derive(Deserialize)]
pub struct RegisterInput {
    pub email: String,
    pub password: String,
}

/// Read the effective single_workspace_mode from DB + env override
async fn is_single_workspace_mode(db: &sea_orm::DatabaseConnection) -> bool {
    use crate::db::entities::system_settings;
    use sea_orm::EntityTrait;

    let row = system_settings::Entity::find().one(db).await.ok().flatten();
    let db_value = row.map(|s| s.single_workspace_mode).unwrap_or(false);
    let (effective, _) = resolve_single_workspace_mode(db_value);
    effective
}

pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(body): Json<RegisterInput>,
) -> Response {
    // Check if email is already taken
    match AuthRepo::find_user_by_email(&state.db, &body.email).await {
        Ok(Some(_)) => return AppError::Conflict("该邮箱已被注册".into()).into_response(),
        Err(e) => return e.into_response(),
        Ok(None) => {}
    }

    let password_hash = match hash_password(&body.password) {
        Ok(h) => h,
        Err(e) => return AppError::Internal(e).into_response(),
    };

    // First user becomes superadmin, subsequent users are regular users
    let user_count = match AuthRepo::count_users(&state.db).await {
        Ok(n) => n,
        Err(e) => return e.into_response(),
    };
    let role = if user_count == 0 {
        UserRole::Superadmin
    } else {
        UserRole::User
    };

    // Derive a display name from the email prefix
    let name = body
        .email
        .split('@')
        .next()
        .unwrap_or("User")
        .to_string();

    let user = match AuthRepo::create_user(&state.db, &name, &body.email, &password_hash, role)
        .await
    {
        Ok(u) => u,
        Err(e) => return e.into_response(),
    };

    let user_id_str = user.id.clone();

    // Create session
    let session_id = match AuthRepo::create_session(&state.db, &user.id).await {
        Ok(s) => s,
        Err(e) => return e.into_response(),
    };

    // Check single workspace mode
    let single_mode = is_single_workspace_mode(&state.db).await;

    let workspace = if single_mode {
        // Single workspace mode: join the shared workspace
        match WorkspaceRepo::get_or_create_shared(&state.db, &user_id_str).await {
            Ok(ws) => {
                // Add user as member if not already (get_or_create_shared only adds the creator)
                if let Err(e) = WorkspaceRepo::add_member(
                    &state.db,
                    &ws.id,
                    &user_id_str,
                    WorkspaceMemberRole::Member,
                )
                .await
                {
                    return e.into_response();
                }
                ws
            }
            Err(e) => return e.into_response(),
        }
    } else {
        // Normal mode: create personal workspace
        let slug = format!("ws-{}", &user_id_str[..8]);
        match WorkspaceRepo::create_with_owner(
            &state.db,
            &format!("{}'s workspace", name),
            &slug,
            &user_id_str,
        )
        .await
        {
            Ok(ws) => ws,
            Err(e) => return e.into_response(),
        }
    };

    let output = AuthOutput {
        user: UserDto::from(user),
        default_workspace_slug: workspace.slug,
    };

    build_session_response(output, &session_id)
}

use chrono::Utc;
use sea_orm::*;
use uuid::Uuid;

use crate::db::entities::workspace_members::WorkspaceMemberRole;
use crate::db::entities::{workspace_members, workspaces};
use crate::error::AppError;

/// Slug used for the shared workspace in single workspace mode
pub const SYSTEM_SHARED_SLUG: &str = "::SYSTEM_SHARED::";

pub struct WorkspaceRepo;

impl WorkspaceRepo {
    pub async fn list_by_user(
        db: &DatabaseConnection,
        user_id: &str,
    ) -> Result<Vec<workspaces::Model>, AppError> {
        let member_rows = workspace_members::Entity::find()
            .filter(workspace_members::Column::UserId.eq(user_id))
            .all(db)
            .await?;

        let workspace_ids: Vec<String> =
            member_rows.iter().map(|m| m.workspace_id.clone()).collect();
        if workspace_ids.is_empty() {
            return Ok(vec![]);
        }

        Ok(workspaces::Entity::find()
            .filter(workspaces::Column::Id.is_in(workspace_ids))
            .all(db)
            .await?)
    }

    /// Create workspace and add owner as member
    pub async fn create_with_owner(
        db: &DatabaseConnection,
        name: &str,
        slug: &str,
        user_id: &str,
    ) -> Result<workspaces::Model, AppError> {
        let ws_id = Uuid::new_v4().to_string();

        let ws = workspaces::ActiveModel {
            id: Set(ws_id.clone()),
            slug: Set(slug.to_string()),
            name: Set(name.to_string()),
            description: Set(None),
            owner_id: Set(Some(user_id.to_string())),
            created_at: Set(Some(Utc::now().into())),
        };
        workspaces::Entity::insert(ws).exec(db).await?;

        let member = workspace_members::ActiveModel {
            id: Set(Uuid::new_v4().to_string()),
            workspace_id: Set(ws_id.clone()),
            user_id: Set(user_id.to_string()),
            role: Set(WorkspaceMemberRole::Owner),
            created_at: Set(Some(Utc::now().into())),
        };
        workspace_members::Entity::insert(member).exec(db).await?;

        workspaces::Entity::find_by_id(ws_id)
            .one(db)
            .await?
            .ok_or_else(|| AppError::Internal("failed to fetch created workspace".into()))
    }

    pub async fn get_first_by_user(
        db: &DatabaseConnection,
        user_id: &str,
    ) -> Result<Option<workspaces::Model>, AppError> {
        let member = workspace_members::Entity::find()
            .filter(workspace_members::Column::UserId.eq(user_id))
            .one(db)
            .await?;

        match member {
            Some(m) => Ok(workspaces::Entity::find_by_id(m.workspace_id).one(db).await?),
            None => Ok(None),
        }
    }

    pub async fn find_by_slug(
        db: &DatabaseConnection,
        slug: &str,
    ) -> Result<Option<workspaces::Model>, AppError> {
        Ok(workspaces::Entity::find()
            .filter(workspaces::Column::Slug.eq(slug))
            .one(db)
            .await?)
    }

    pub async fn find_by_id(
        db: &DatabaseConnection,
        id: &str,
    ) -> Result<Option<workspaces::Model>, AppError> {
        Ok(workspaces::Entity::find_by_id(id).one(db).await?)
    }

    pub async fn is_member(
        db: &DatabaseConnection,
        workspace_id: &str,
        user_id: &str,
    ) -> Result<bool, AppError> {
        let member = workspace_members::Entity::find()
            .filter(workspace_members::Column::WorkspaceId.eq(workspace_id))
            .filter(workspace_members::Column::UserId.eq(user_id))
            .one(db)
            .await?;
        Ok(member.is_some())
    }

    /// Get or create the shared workspace for single workspace mode.
    /// The first user to trigger this becomes the owner.
    pub async fn get_or_create_shared(
        db: &DatabaseConnection,
        user_id: &str,
    ) -> Result<workspaces::Model, AppError> {
        if let Some(existing) = Self::find_by_slug(db, SYSTEM_SHARED_SLUG).await? {
            return Ok(existing);
        }

        let ws_id = Uuid::new_v4().to_string();
        let ws = workspaces::ActiveModel {
            id: Set(ws_id.clone()),
            slug: Set(SYSTEM_SHARED_SLUG.to_string()),
            name: Set("Shared Workspace".to_string()),
            description: Set(Some(
                "System shared workspace for single workspace mode".to_string(),
            )),
            owner_id: Set(None),
            created_at: Set(Some(Utc::now().into())),
        };
        workspaces::Entity::insert(ws).exec(db).await?;

        let member = workspace_members::ActiveModel {
            id: Set(Uuid::new_v4().to_string()),
            workspace_id: Set(ws_id.clone()),
            user_id: Set(user_id.to_string()),
            role: Set(WorkspaceMemberRole::Owner),
            created_at: Set(Some(Utc::now().into())),
        };
        workspace_members::Entity::insert(member).exec(db).await?;

        workspaces::Entity::find_by_id(ws_id)
            .one(db)
            .await?
            .ok_or_else(|| AppError::Internal("failed to fetch created shared workspace".into()))
    }

    /// Add a user as member of an existing workspace
    pub async fn add_member(
        db: &DatabaseConnection,
        workspace_id: &str,
        user_id: &str,
        role: WorkspaceMemberRole,
    ) -> Result<(), AppError> {
        let existing = workspace_members::Entity::find()
            .filter(workspace_members::Column::WorkspaceId.eq(workspace_id))
            .filter(workspace_members::Column::UserId.eq(user_id))
            .one(db)
            .await?;

        if existing.is_some() {
            return Ok(());
        }

        let member = workspace_members::ActiveModel {
            id: Set(Uuid::new_v4().to_string()),
            workspace_id: Set(workspace_id.to_string()),
            user_id: Set(user_id.to_string()),
            role: Set(role),
            created_at: Set(Some(Utc::now().into())),
        };
        workspace_members::Entity::insert(member).exec(db).await?;
        Ok(())
    }

    pub async fn update(
        db: &DatabaseConnection,
        id: &str,
        name: Option<String>,
        slug: Option<String>,
        description: Option<String>,
    ) -> Result<workspaces::Model, AppError> {
        let ws = workspaces::Entity::find_by_id(id)
            .one(db)
            .await?
            .ok_or_else(|| AppError::NotFound("Workspace not found".into()))?;
        let mut active: workspaces::ActiveModel = ws.into();
        if let Some(n) = name {
            active.name = Set(n);
        }
        if let Some(s) = slug {
            active.slug = Set(s);
        }
        if let Some(d) = description {
            active.description = Set(Some(d));
        }
        Ok(active.update(db).await?)
    }

    pub async fn delete(db: &DatabaseConnection, id: &str) -> Result<(), AppError> {
        workspaces::Entity::delete_by_id(id).exec(db).await?;
        Ok(())
    }

    pub async fn ensure_unique_slug(
        db: &DatabaseConnection,
        base: &str,
    ) -> Result<String, AppError> {
        let base_slug = if base.is_empty() {
            "workspace".to_string()
        } else {
            base.to_string()
        };
        let mut slug = base_slug.clone();
        let mut suffix = 1u32;
        loop {
            if slug == SYSTEM_SHARED_SLUG {
                slug = format!("{base_slug}-{suffix}");
                suffix += 1;
                continue;
            }
            let existing = workspaces::Entity::find()
                .filter(workspaces::Column::Slug.eq(&slug))
                .one(db)
                .await?;
            if existing.is_none() {
                break;
            }
            slug = format!("{base_slug}-{suffix}");
            suffix += 1;
        }
        Ok(slug)
    }
}

use chrono::Utc;
use sea_orm::*;
use tracing::error;
use uuid::Uuid;

use crate::db::entities::sessions;
use crate::db::entities::users::{self, UserRole};
use crate::error::AppError;

pub struct AuthRepo;

impl AuthRepo {
    pub async fn find_user_by_email(
        db: &DatabaseConnection,
        email: &str,
    ) -> Result<Option<users::Model>, AppError> {
        Ok(users::Entity::find()
            .filter(users::Column::Email.eq(email))
            .one(db)
            .await?)
    }

    pub async fn count_users(db: &DatabaseConnection) -> Result<u64, AppError> {
        Ok(users::Entity::find().count(db).await?)
    }

    pub async fn create_user(
        db: &DatabaseConnection,
        name: &str,
        email: &str,
        password_hash: &str,
        role: UserRole,
    ) -> Result<users::Model, AppError> {
        let id = Uuid::new_v4().to_string();
        let active = users::ActiveModel {
            id: Set(id.clone()),
            name: Set(name.to_string()),
            email: Set(email.to_string()),
            password_hash: Set(password_hash.to_string()),
            role: Set(role),
            settings: Set(None),
            created_at: Set(Some(Utc::now().into())),
        };
        users::Entity::insert(active).exec(db).await?;
        users::Entity::find_by_id(id)
            .one(db)
            .await?
            .ok_or_else(|| AppError::Internal("failed to fetch created user".into()))
    }

    pub async fn create_session(
        db: &DatabaseConnection,
        user_id: &str,
    ) -> Result<String, AppError> {
        let session_id = Uuid::new_v4().to_string();
        let expires_at = (Utc::now() + chrono::Duration::days(7)).into();
        let active = sessions::ActiveModel {
            id: Set(session_id.clone()),
            user_id: Set(user_id.to_string()),
            expires_at: Set(expires_at),
            created_at: Set(Some(Utc::now().into())),
        };
        sessions::Entity::insert(active).exec(db).await?;
        Ok(session_id)
    }

    pub async fn get_user_id_by_session(
        db: &DatabaseConnection,
        session_id: &str,
    ) -> Result<Option<String>, AppError> {
        let row = sessions::Entity::find_by_id(session_id)
            .filter(sessions::Column::ExpiresAt.gt(Utc::now()))
            .one(db)
            .await
            .map_err(|err| {
                error!("get_user_id_by_session failed: {}", err);
                AppError::Internal("Session lookup failed".into())
            })?;
        Ok(row.map(|r| r.user_id))
    }

    pub async fn delete_session(db: &DatabaseConnection, session_id: &str) -> Result<(), AppError> {
        sessions::Entity::delete_by_id(session_id)
            .exec(db)
            .await?;
        Ok(())
    }

    pub async fn delete_other_sessions(
        db: &DatabaseConnection,
        user_id: &str,
        keep_session_id: &str,
    ) -> Result<(), AppError> {
        sessions::Entity::delete_many()
            .filter(sessions::Column::UserId.eq(user_id))
            .filter(sessions::Column::Id.ne(keep_session_id))
            .exec(db)
            .await?;
        Ok(())
    }
}

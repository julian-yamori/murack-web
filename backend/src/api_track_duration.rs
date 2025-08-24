use std::ops::Deref;

use murack_core_domain::track::TrackDuration;
use serde::{Deserialize, Serialize};
use utoipa::{
    PartialSchema, ToSchema,
    openapi::{KnownFormat, ObjectBuilder, RefOr, Schema, SchemaFormat, Type},
};

/// API でやり取りする、曲の再生時間
///
/// ミリ秒単位の数値で API の値と変換する。
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone, Copy)]
pub struct ApiTrackDuration(TrackDuration);

impl ApiTrackDuration {
    pub fn from_millis(millis: u64) -> Self {
        let td: TrackDuration = std::time::Duration::from_millis(millis).into();
        td.into()
    }
}

impl From<TrackDuration> for ApiTrackDuration {
    fn from(value: TrackDuration) -> Self {
        Self(value)
    }
}

impl From<ApiTrackDuration> for TrackDuration {
    fn from(value: ApiTrackDuration) -> Self {
        value.0
    }
}

impl Deref for ApiTrackDuration {
    type Target = std::time::Duration;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Serialize for ApiTrackDuration {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let millis = self.as_millis();
        millis.serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for ApiTrackDuration {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let millis = u64::deserialize(deserializer)?;
        Ok(Self::from_millis(millis))
    }
}

impl ToSchema for ApiTrackDuration {}

impl PartialSchema for ApiTrackDuration {
    fn schema() -> RefOr<Schema> {
        RefOr::T(Schema::Object(
            ObjectBuilder::new()
                .schema_type(Type::Integer)
                .format(Some(SchemaFormat::KnownFormat(KnownFormat::Int64)))
                .description(Some("曲の再生時間 (ミリ秒単位)"))
                .build(),
        ))
    }
}

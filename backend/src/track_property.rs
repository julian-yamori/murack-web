//! 曲のプロパティ画面関連

pub mod handlers;

pub mod single_track_property;
pub use single_track_property::SingleTrackProperty;

pub mod track_artwork;
pub use track_artwork::TrackArtwork;

mod track_row;
use track_row::TrackRow;

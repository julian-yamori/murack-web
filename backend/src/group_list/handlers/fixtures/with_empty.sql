-- Test fixture for empty string data handling
-- This sets up tracks with empty string values for genre, artist, album

INSERT INTO tracks (
    id, duration, path, title, 
    artist, album_artist, album, genre,
    artist_order, album_artist_order, album_order, genre_order
) VALUES 
    -- 空文字列ジャンルのデータ
    (1, 180, '/music/unknown.mp3', 'Unknown Song', 
     'Unknown Artist', 'Unknown Artist', 'Unknown Album', '',
     'unknown artist', 'unknown artist', 'unknown album', ''),
    
    -- 正常データも含める
    (2, 200, '/music/normal.mp3', 'Normal Song', 
     'Normal Artist', 'Normal Artist', 'Normal Album', 'Rock',
     'normal artist', 'normal artist', 'normal album', 'rock');
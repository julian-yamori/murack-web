-- Test fixture for duplicate data handling (DISTINCT test)
-- This sets up multiple tracks with same genre to test DISTINCT functionality

INSERT INTO tracks (
    id, duration, path, title, 
    artist, album_artist, album, genre,
    artist_order, album_artist_order, album_order, genre_order
) VALUES 
    -- 同じジャンル「Rock」の複数の曲
    (1, 180, '/music/rock1.mp3', 'Rock Song 1', 
     'Rock Artist 1', 'Rock Artist 1', 'Rock Album 1', 'Rock',
     'Rock Artist 1', 'Rock Artist 1', 'Rock Album 1', 'Rock'),
    
    (2, 200, '/music/rock2.mp3', 'Rock Song 2', 
     'Rock Artist 2', 'Rock Artist 2', 'Rock Album 2', 'Rock',
     'Rock Artist 2', 'Rock Artist 2', 'Rock Album 2', 'Rock'),
    
    (3, 220, '/music/rock3.mp3', 'Rock Song 3', 
     'Rock Artist 3', 'Rock Artist 3', 'Rock Album 3', 'Rock',
     'Rock Artist 3', 'Rock Artist 3', 'Rock Album 3', 'Rock');
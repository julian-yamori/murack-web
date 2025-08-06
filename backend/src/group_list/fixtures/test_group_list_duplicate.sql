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
     'rock artist 1', 'rock artist 1', 'rock album 1', 'rock'),
    
    (2, 200, '/music/rock2.mp3', 'Rock Song 2', 
     'Rock Artist 2', 'Rock Artist 2', 'Rock Album 2', 'Rock',
     'rock artist 2', 'rock artist 2', 'rock album 2', 'rock'),
    
    (3, 220, '/music/rock3.mp3', 'Rock Song 3', 
     'Rock Artist 3', 'Rock Artist 3', 'Rock Album 3', 'Rock',
     'rock artist 3', 'rock artist 3', 'rock album 3', 'rock');
-- Test fixture for normal group list test data
-- This sets up tracks with various genres, artists, and albums

INSERT INTO tracks (
    id, duration, path, title, 
    artist, album_artist, album, genre,
    artist_order, album_artist_order, album_order, genre_order
) VALUES 
    -- Rock ジャンルのデータ
    (1, 180, '/music/track1.mp3', 'Song 1', 
     'Artist A', 'Artist A', 'Album 1', 'Rock',
     'Artist A', 'Artist A', 'Album 1', 'Rock'),
    
    (2, 200, '/music/track2.mp3', 'Song 2', 
     'Artist B', 'Artist B', 'Album 3', 'Rock',
     'Artist B', 'Artist B', 'Album 3', 'Rock'),
    
    -- Jazz ジャンルのデータ
    (3, 240, '/music/track3.mp3', 'Song 3', 
     'Artist C', 'Artist C', 'Album 2', 'Jazz',
     'Artist C', 'Artist C', 'Album 2', 'Jazz');
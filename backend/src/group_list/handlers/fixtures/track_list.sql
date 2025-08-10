-- Test fixture for get_track_list() test data

INSERT INTO tracks (
    id, duration, path, title, track_number,
    artist, album_artist, album, genre,
    artist_order, album_artist_order, album_order, genre_order
) VALUES 
    -- Album 1 (Artist A)
    (1, 180, '/album1/track1.mp3', 'Track 1-1', 1,
     'Artist A', 'Artist A', 'Album 1', 'Rock',
     'artist a', 'artist a', 'album 1', 'rock'),
    (2, 170, '/album1/track2.mp3', 'Track 1-2', 2,
     'Artist A', 'Artist A', 'Album 1', 'Rock',
     'artist a', 'artist a', 'album 1', 'rock'),
    
    -- Album 2 (Artist A)
    (3, 240, '/album2/track1.mp3', 'Track 2-1', 1,
     'Artist A', 'Artist A', 'Album 2', 'Jazz',
     'artist a', 'artist a', 'album 2', 'jazz'),
    (4, 230, '/album2/track2.mp3', 'Track 2-2', 2,
     'Artist A', 'Artist A', 'Album 2', 'Jazz',
     'artist a', 'artist a', 'album 2', 'jazz'),
    
    -- Album 3 (Artist B)
    (5, 200, '/album3/track1.mp3', 'Track 3-1', 1,
     'Artist B', '', 'Album 3', 'Rock',
     'artist b', '', 'album 3', 'rock'),
    (6, 190, '/album3/track2.mp3', 'Track 3-2', 2,
     'Artist B', '', 'Album 3', 'Rock',
     'artist b', '', 'album 3', 'rock'),
    
    -- Album 4
    -- Artist A の別アルバムで、 artist が別名になっているもの
    (7, 280, '/album4/track1.mp3', 'Track 4-1', 1,
     'Artist A ANOTHER', 'Artist A', 'Album 4', 'Rock',
     'artist a another', 'artist a', 'album 4', 'Rock'),
    (8, 270, '/album4/track2.mp3', 'Track 4-2', 2,
     'Artist A ANOTHER', 'Artist A', 'Album 4', 'Rock',
     'artist a another', 'artist a', 'album 4', 'Rock');

INSERT INTO track_artworks(track_id, order_index, artwork_id, picture_type, description) VALUES
    -- Album 1 にはアートワークを 2 つ付けてみる
    (1, 0, 1, 1, ''), (1, 1, 2, 3, ''),
    (2, 0, 1, 1, ''), (2, 1, 2, 3, ''),

    -- Album 2 はアートワーク無し

    -- Album 3
    (5, 0, 3, 3, ''),
    (6, 0, 3, 3, ''),

    -- Album 4
    (7, 0, 4, 3, ''),
    (8, 0, 4, 3, '');

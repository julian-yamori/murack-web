-- 並び替えに order 系カラムを使用することを確認するテスト

INSERT INTO tracks (
    id, duration, path, title, 
    artist, album, genre,
    artist_order, album_order, genre_order
) VALUES 
    (1, 180, '/music/track1.mp3', 'Track 1', 
     'DEF', 'あいう', 'ghr',
     'def', 'あいう', 'ghr'),
    
    (2, 200, '/music/track2.mp3', 'Track 2', 
     'ghr', 'カキク', 'abc',
     'ghr', 'かきく', 'abc'),
    
    (3, 220, '/music/track3.mp3', 'Track 3', 
     'abc', 'さしす', 'DEF',
     'abc', 'さしす', 'def');
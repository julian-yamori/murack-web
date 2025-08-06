-- 並び替えに order 系カラムを使用することを確認するテスト
--
-- PostgreSQL ではデフォルトの照合順序 (Collation) だと、大文字やカタカナも含めて辞書順でソートされる。
-- そのため、order 系カラムが実際に使われてるかどうかは、本体カラムとは明らかに異なる値にしないと確認できない。
-- (じゃあ order 系カラムは要らない？ -> murack-core #24)

INSERT INTO tracks (
    id, duration, path, title, 
    artist, album, genre,
    artist_order, album_order, genre_order
) VALUES 
    (1, 180, '/music/track1.mp3', 'Track 1', 
     'DEF', 'あいう', 'ghr',
     '2', '3', '1'),
    
    (2, 200, '/music/track2.mp3', 'Track 2', 
     'ghr', 'カキク', 'abc',
     '1', '2', '3'),
    
    (3, 220, '/music/track3.mp3', 'Track 3', 
     'abc', 'さしす', 'DEF',
     '3', '1', '2');
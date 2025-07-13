-- Create songs table
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    artist VARCHAR NOT NULL, 
    album VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for testing
INSERT INTO songs (title, artist, album) VALUES
    ('Sample Song 1', 'Test Artist 1', 'Test Album 1'),
    ('Sample Song 2', 'Test Artist 2', 'Test Album 2'),
    ('Sample Song 3', 'Test Artist 3', NULL);
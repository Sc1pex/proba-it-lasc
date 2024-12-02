CREATE TABLE Recipes(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    author_id UUID REFERENCES Users(id),

    name TEXT NOT NULL,
    description TEXT NOT NULL,

    image BYTEA NOT NULL
)

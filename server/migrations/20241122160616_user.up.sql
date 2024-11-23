CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL
);

CREATE TABLE UserSessions(
    session_id UUID PRIMARY KEY,
    user_id UUID REFERENCES Users(id),

    created_at TIMESTAMP DEFAULT current_timestamp
);

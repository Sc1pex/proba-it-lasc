CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL
);

CREATE TABLE UserSessions(
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(id),

    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

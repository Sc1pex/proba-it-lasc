CREATE TABLE Ratings(
    user_id UUID REFERENCES Users(id),
    recipe_id UUID REFERENCES Recipes(id),

    rating INT NOT NULL,

    PRIMARY KEY(user_id, recipe_id)
);

ALTER TABLE Recipes
ADD COLUMN num_ratings INT DEFAULT 0,
ADD COLUMN ratings_sum FLOAT DEFAULT 0;

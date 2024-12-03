DROP TABLE Ratings;

ALTER TABLE Recipes
DROP COLUMN num_ratings,
DROP COLUMN ratings_sum;

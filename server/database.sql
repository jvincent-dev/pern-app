--used to create postgres database
CREATE DATABASE pern_todos;

CREATE TABLE todo (
  todo_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(80) NOT NULL,
  description VARCHAR(255),
  id_edited BOOLEAN DEFAULT false,
  last_edited DATE DEFAULT NULL
);
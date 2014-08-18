-- postgresql://noah@localhost/forum

-- create database forum;
-- \connect forum
create table forum_user (
  id serial primary key,
  name text,
  created_at timestamp,
  updated_at timestamp
);

-- postgresql://noah@localhost/forum

-- create database forum;
-- \connect forum
create table post (
  id serial primary key,
  body text,
  user_id integer,
  created_at timestamp,
  updated_at timestamp
);

CREATE TABLE emoji (
    id integer NOT NULL,
    keyword text,
    url text,
    classname text
);

CREATE TABLE forum_user (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    password character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    signature text,
    last_visited json,
    hide_connected boolean,
    custom_code text
);

CREATE TABLE post (
    id integer NOT NULL,
    body text,
    user_id integer NOT NULL,
    parent integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    title text
);

CREATE TABLE session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE ONLY emoji
    ADD CONSTRAINT emoji_pkey PRIMARY KEY (id);

ALTER TABLE ONLY forum_user
    ADD CONSTRAINT forum_user_pkey PRIMARY KEY (id);

ALTER TABLE ONLY post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);

CREATE INDEX post_parent ON post USING hash (parent);

CREATE INDEX post_parent_null_index ON post USING btree (parent) WHERE (parent IS NULL);

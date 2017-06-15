CREATE TABLE emoji (
    id integer NOT NULL,
    keyword text,
    url text,
    classname text
);

CREATE SEQUENCE emoji_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE emoji_id_seq OWNED BY emoji.id;

ALTER TABLE ONLY emoji ALTER COLUMN id SET DEFAULT nextval('emoji_id_seq'::regclass);

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
    custom_code text,
    is_supporter timestamp with time zone,
    is_v2 boolean
);

CREATE SEQUENCE forum_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE forum_user_id_seq OWNED BY forum_user.id;

ALTER TABLE ONLY forum_user ALTER COLUMN id SET DEFAULT nextval('forum_user_id_seq'::regclass);

CREATE TABLE post (
    id integer NOT NULL,
    body text,
    user_id integer NOT NULL,
    parent integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    title text
);

CREATE SEQUENCE post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE post_id_seq OWNED BY post.id;

ALTER TABLE ONLY post ALTER COLUMN id SET DEFAULT nextval('post_id_seq'::regclass);

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

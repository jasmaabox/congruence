
CREATE TABLE associations (
    id SERIAL PRIMARY KEY,
    association_name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    association_id INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    verified_account BOOLEAN,
    user_level INTEGER /* 0:student, 1:instructor, 2:admin, 3:super admin */
);
CREATE INDEX n_idx ON users USING btree (id);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL
);

CREATE TABLE users_courses (
    user_id INTEGER REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses (id) on UPDATE CASCADE,
    CONSTRAINT id PRIMARY KEY (user_id, course_id)
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    assignment_name VARCHAR(255) NOT NULL,
    points INTEGER
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL,
    submitter_id INTEGER NOT NULL,
    submit_timestamp TIMESTAMP WITH TIME ZONE,
    points_earned INTEGER
);


/* Create admin user */
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('admin', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'admin@gmail.com', true, 3, 1);

/* dummy entries */
INSERT INTO associations (association_name) VALUES ('Awesome School');
INSERT INTO courses (course_name) VALUES ('Programming 1');
INSERT INTO courses (course_name) VALUES ('Algorithms and Data Structures');
INSERT INTO courses (course_name) VALUES ('Analysis of Algorithms');
INSERT INTO courses (course_name) VALUES ('Software Design');
INSERT INTO courses (course_name) VALUES ('AI with LISP');
INSERT INTO courses (course_name) VALUES ('Graphics');
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('a', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'a@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('b', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'b@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('c', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'c@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('d', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'd@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('e', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'e@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('f', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'f@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('g', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'g@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('h', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'h@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('i', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'i@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('j', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'j@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('k', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'k@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('l', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'l@gmail.com', true, 0, 1);
INSERT INTO users (username, password, email, verified_account, user_level, association_id)
VALUES ('m', '$2a$10$siCgGUWF8SLY3faKiy4bSOq3D5upZ6UZaoswP7XWPW6lP9PqwCMBO', 'm@gmail.com', true, 0, 1);
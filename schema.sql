CREATE TABLE if not exists profile (
    id integer primary key autoincrement,
    name varchar(255) unique
);

CREATE TABLE if not exists connection (
    id integer primary key autoincrement,
    profileId integer,
    name varchar(255) unique,
    configuration text,
    foreign key(profileId) references profile(id)
);
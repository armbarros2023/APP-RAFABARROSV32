CREATE DATABASE "app-rafabarros";
CREATE USER clinicapp WITH PASSWORD 'Ra483220fa';
GRANT ALL PRIVILEGES ON DATABASE "app-rafabarros" TO clinicapp;
\c app-rafabarros
GRANT ALL ON SCHEMA public TO clinicapp;
\l

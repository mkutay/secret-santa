SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: secret_santas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."secret_santas" ("id", "created_at", "code") VALUES
	('842031ed-2134-46c6-b3ce-7f8d0f82d08b', '2025-11-03 17:05:06.907935+00', 'amogus');


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."submissions" ("id", "created_at", "secret_santa_id", "name", "country") VALUES
	('3be30750-d8ce-43e8-a6d2-3ca8ee81837f', '2025-11-03 17:19:34.920277+00', '842031ed-2134-46c6-b3ce-7f8d0f82d08b', 'Kutay', 'Ingiltere');


--
-- PostgreSQL database dump complete
--

RESET ALL;

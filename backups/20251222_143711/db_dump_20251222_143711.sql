--
-- PostgreSQL database dump
--

\restrict ZW9eBma8hMh5NU0nOc3OLDjsPf94Iyw625QfdLboasU4WGEt8Nm1JwdKDifKxyn

-- Dumped from database version 17.7 (Ubuntu 17.7-0ubuntu0.25.04.1)
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-0ubuntu0.25.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'SCHEDULED',
    'CANCELLED',
    'COMPLETED',
    'PENDING_ACCEPTANCE'
);


ALTER TYPE public."AppointmentStatus" OWNER TO clinicapp;

--
-- Name: AssessmentStatus; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."AssessmentStatus" AS ENUM (
    'SCHEDULED',
    'COMPLETED'
);


ALTER TYPE public."AssessmentStatus" OWNER TO clinicapp;

--
-- Name: FinancialCategory; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."FinancialCategory" AS ENUM (
    'RECEITA_ATENDIMENTO',
    'RECEITA_CURSO',
    'RECEITA_KIT',
    'CUSTO_FIXO',
    'CUSTO_VARIAVEL',
    'INVESTIMENTO',
    'CAPITAL_GIRO'
);


ALTER TYPE public."FinancialCategory" OWNER TO clinicapp;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'PENDING',
    'PAID',
    'OVERDUE'
);


ALTER TYPE public."InvoiceStatus" OWNER TO clinicapp;

--
-- Name: MediaType; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."MediaType" AS ENUM (
    'VIDEO',
    'IMAGE',
    'DOCUMENT'
);


ALTER TYPE public."MediaType" OWNER TO clinicapp;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'PIX',
    'DEBITO',
    'CREDITO_RECORRENTE',
    'FIDELIDADE_TRIMESTRAL',
    'FIDELIDADE_SEMESTRAL',
    'FIDELIDADE_ANUAL'
);


ALTER TYPE public."PaymentMethod" OWNER TO clinicapp;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID'
);


ALTER TYPE public."PaymentStatus" OWNER TO clinicapp;

--
-- Name: StaffStatus; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."StaffStatus" AS ENUM (
    'ACTIVE',
    'ON_VACATION',
    'INACTIVE'
);


ALTER TYPE public."StaffStatus" OWNER TO clinicapp;

--
-- Name: StudentStatus; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."StudentStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."StudentStatus" OWNER TO clinicapp;

--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'PAID',
    'PENDING'
);


ALTER TYPE public."TransactionStatus" OWNER TO clinicapp;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."TransactionType" AS ENUM (
    'REVENUE',
    'EXPENSE'
);


ALTER TYPE public."TransactionType" OWNER TO clinicapp;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: clinicapp
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'THERAPIST'
);


ALTER TYPE public."UserRole" OWNER TO clinicapp;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id text NOT NULL,
    "branchId" text NOT NULL,
    "therapistId" text,
    "studentId" text,
    "dateTime" timestamp(3) without time zone NOT NULL,
    "studentName" text NOT NULL,
    "therapistName" text,
    service text NOT NULL,
    status public."AppointmentStatus" DEFAULT 'SCHEDULED'::public."AppointmentStatus" NOT NULL,
    notes text,
    "cancellationReason" text,
    "cancelledBy" text,
    "reminderSent" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id text NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    cnpj text,
    "stateRegistration" text,
    email text,
    responsible text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: external_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.external_activities (
    id text NOT NULL,
    name text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    revenue double precision NOT NULL,
    expenses double precision NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.external_activities OWNER TO postgres;

--
-- Name: financial_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_transactions (
    id text NOT NULL,
    "branchId" text NOT NULL,
    "studentId" text,
    date timestamp(3) without time zone NOT NULL,
    description text NOT NULL,
    amount double precision NOT NULL,
    "taxPercentage" double precision,
    type public."TransactionType" NOT NULL,
    category public."FinancialCategory" NOT NULL,
    status public."TransactionStatus" DEFAULT 'PENDING'::public."TransactionStatus" NOT NULL,
    "nfeNumber" text,
    "dueDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.financial_transactions OWNER TO postgres;

--
-- Name: initial_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initial_assessments (
    id text NOT NULL,
    "studentId" text,
    "studentName" text NOT NULL,
    "guardianEmail" text,
    "guardianPhone" text,
    "branchId" text NOT NULL,
    "therapistId" text NOT NULL,
    "dateTime" timestamp(3) without time zone NOT NULL,
    status public."AssessmentStatus" DEFAULT 'SCHEDULED'::public."AssessmentStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.initial_assessments OWNER TO postgres;

--
-- Name: staff_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_members (
    id text NOT NULL,
    "branchId" text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    email text NOT NULL,
    "secondaryEmail" text,
    phone text,
    status public."StaffStatus" DEFAULT 'ACTIVE'::public."StaffStatus" NOT NULL,
    "avatarUrl" text,
    specialty text,
    "bankInfo" text,
    "contractUrl" text,
    "admissionDate" timestamp(3) without time zone,
    "terminationDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.staff_members OWNER TO postgres;

--
-- Name: student_activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_activity_logs (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "therapistId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.student_activity_logs OWNER TO postgres;

--
-- Name: student_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_invoices (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "branchId" text NOT NULL,
    "issueDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    amount double precision NOT NULL,
    status public."InvoiceStatus" DEFAULT 'PENDING'::public."InvoiceStatus" NOT NULL,
    "paymentLink" text,
    "receiptUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.student_invoices OWNER TO postgres;

--
-- Name: student_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_media (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "therapistId" text NOT NULL,
    "uploadDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    url text NOT NULL,
    type public."MediaType" NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.student_media OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id text NOT NULL,
    "branchId" text NOT NULL,
    "therapistId" text NOT NULL,
    name text NOT NULL,
    "avatarUrl" text,
    "dateOfBirth" timestamp(3) without time zone,
    "guardianName" text,
    "guardianPhone" text,
    "guardianEmail" text,
    status public."StudentStatus" DEFAULT 'ACTIVE'::public."StudentStatus" NOT NULL,
    "lastActivityDate" timestamp(3) without time zone,
    "wantsMonthlyNFe" boolean DEFAULT false NOT NULL,
    rg text,
    cpf text,
    address text,
    neighborhood text,
    city text,
    "postalCode" text,
    "sessionsPerMonth" integer,
    "monthlyValue" double precision,
    "paymentMethod" public."PaymentMethod",
    "taxPercentage" double precision,
    "planObservations" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: therapist_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.therapist_payments (
    id text NOT NULL,
    "therapistId" text NOT NULL,
    "branchId" text NOT NULL,
    "therapistName" text NOT NULL,
    period text NOT NULL,
    "sessionsConducted" integer NOT NULL,
    amount double precision NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "invoiceUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.therapist_payments OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'THERAPIST'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, "branchId", "therapistId", "studentId", "dateTime", "studentName", "therapistName", service, status, notes, "cancellationReason", "cancelledBy", "reminderSent", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, name, address, phone, cnpj, "stateRegistration", email, responsible, "createdAt", "updatedAt") FROM stdin;
1ba98237-065e-4c72-850b-2099cb15dced	Clínica Rafa Barros - Matriz	Endereço da Clínica	(00) 00000-0000	\N	\N	contato@clinicrafabarros.com.br	Armando de Barros	2025-12-18 16:56:07.854	2025-12-18 16:56:07.854
\.


--
-- Data for Name: external_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.external_activities (id, name, date, revenue, expenses, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: financial_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.financial_transactions (id, "branchId", "studentId", date, description, amount, "taxPercentage", type, category, status, "nfeNumber", "dueDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: initial_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.initial_assessments (id, "studentId", "studentName", "guardianEmail", "guardianPhone", "branchId", "therapistId", "dateTime", status, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: staff_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff_members (id, "branchId", name, role, email, "secondaryEmail", phone, status, "avatarUrl", specialty, "bankInfo", "contractUrl", "admissionDate", "terminationDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: student_activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_activity_logs (id, "studentId", "therapistId", date, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: student_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_invoices (id, "studentId", "branchId", "issueDate", "dueDate", amount, status, "paymentLink", "receiptUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: student_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_media (id, "studentId", "therapistId", "uploadDate", url, type, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, "branchId", "therapistId", name, "avatarUrl", "dateOfBirth", "guardianName", "guardianPhone", "guardianEmail", status, "lastActivityDate", "wantsMonthlyNFe", rg, cpf, address, neighborhood, city, "postalCode", "sessionsPerMonth", "monthlyValue", "paymentMethod", "taxPercentage", "planObservations", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: therapist_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.therapist_payments (id, "therapistId", "branchId", "therapistName", period, "sessionsConducted", amount, status, "invoiceUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
4abaa63d-643c-4544-816c-e21afa7f833e	Armando de Barros	armbarros2023@gmail.com	$2b$10$lP8fWZwwlK9ANmvU.4zrl.4H7YIacd3MZy8MIr1eQmRBbKPAA6kSK	ADMIN	2025-12-22 17:33:52.043	2025-12-22 17:33:52.043
86f941be-6d49-492c-8edd-54a38d95489d	Armando de Barros	armbrros2023@gmail.com	$2b$10$lP8fWZwwlK9ANmvU.4zrl.4H7YIacd3MZy8MIr1eQmRBbKPAA6kSK	ADMIN	2025-12-22 14:26:39.461	2025-12-22 17:33:52.069
\.


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: external_activities external_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.external_activities
    ADD CONSTRAINT external_activities_pkey PRIMARY KEY (id);


--
-- Name: financial_transactions financial_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_transactions
    ADD CONSTRAINT financial_transactions_pkey PRIMARY KEY (id);


--
-- Name: initial_assessments initial_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initial_assessments
    ADD CONSTRAINT initial_assessments_pkey PRIMARY KEY (id);


--
-- Name: staff_members staff_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_members
    ADD CONSTRAINT staff_members_pkey PRIMARY KEY (id);


--
-- Name: student_activity_logs student_activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_activity_logs
    ADD CONSTRAINT student_activity_logs_pkey PRIMARY KEY (id);


--
-- Name: student_invoices student_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_invoices
    ADD CONSTRAINT student_invoices_pkey PRIMARY KEY (id);


--
-- Name: student_media student_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_media
    ADD CONSTRAINT student_media_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: therapist_payments therapist_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.therapist_payments
    ADD CONSTRAINT therapist_payments_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: branches_cnpj_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX branches_cnpj_key ON public.branches USING btree (cnpj);


--
-- Name: staff_members_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX staff_members_email_key ON public.staff_members USING btree (email);


--
-- Name: students_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_cpf_key ON public.students USING btree (cpf);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: appointments appointments_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: appointments appointments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: appointments appointments_therapistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES public.staff_members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: financial_transactions financial_transactions_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_transactions
    ADD CONSTRAINT "financial_transactions_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: financial_transactions financial_transactions_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_transactions
    ADD CONSTRAINT "financial_transactions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: initial_assessments initial_assessments_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initial_assessments
    ADD CONSTRAINT "initial_assessments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: initial_assessments initial_assessments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initial_assessments
    ADD CONSTRAINT "initial_assessments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: initial_assessments initial_assessments_therapistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initial_assessments
    ADD CONSTRAINT "initial_assessments_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES public.staff_members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: staff_members staff_members_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_members
    ADD CONSTRAINT "staff_members_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_activity_logs student_activity_logs_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_activity_logs
    ADD CONSTRAINT "student_activity_logs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_activity_logs student_activity_logs_therapistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_activity_logs
    ADD CONSTRAINT "student_activity_logs_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_invoices student_invoices_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_invoices
    ADD CONSTRAINT "student_invoices_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_invoices student_invoices_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_invoices
    ADD CONSTRAINT "student_invoices_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_media student_media_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_media
    ADD CONSTRAINT "student_media_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_media student_media_therapistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_media
    ADD CONSTRAINT "student_media_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: students students_therapistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES public.staff_members(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: therapist_payments therapist_payments_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.therapist_payments
    ADD CONSTRAINT "therapist_payments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public.branches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: therapist_payments therapist_payments_therapistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.therapist_payments
    ADD CONSTRAINT "therapist_payments_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES public.staff_members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO clinicapp;


--
-- Name: TABLE appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.appointments TO clinicapp;


--
-- Name: TABLE branches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.branches TO clinicapp;


--
-- Name: TABLE external_activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.external_activities TO clinicapp;


--
-- Name: TABLE financial_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.financial_transactions TO clinicapp;


--
-- Name: TABLE initial_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.initial_assessments TO clinicapp;


--
-- Name: TABLE staff_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.staff_members TO clinicapp;


--
-- Name: TABLE student_activity_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_activity_logs TO clinicapp;


--
-- Name: TABLE student_invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_invoices TO clinicapp;


--
-- Name: TABLE student_media; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_media TO clinicapp;


--
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO clinicapp;


--
-- Name: TABLE therapist_payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.therapist_payments TO clinicapp;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO clinicapp;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO clinicapp;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO clinicapp;


--
-- PostgreSQL database dump complete
--

\unrestrict ZW9eBma8hMh5NU0nOc3OLDjsPf94Iyw625QfdLboasU4WGEt8Nm1JwdKDifKxyn


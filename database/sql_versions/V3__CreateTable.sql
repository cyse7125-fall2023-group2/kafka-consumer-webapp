CREATE TABLE IF NOT EXISTS app."health-check"
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status character varying(255) COLLATE pg_catalog."default",
    message character varying(255) COLLATE pg_catalog."default",
    server character varying(255) COLLATE pg_catalog."default",
    expires character varying(255) COLLATE pg_catalog."default",
    date character varying(255) COLLATE pg_catalog."default",
    check_created timestamp with time zone,
    check_updated timestamp with time zone,
    CONSTRAINT "health-check_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app."health-check"
    OWNER to postgres;
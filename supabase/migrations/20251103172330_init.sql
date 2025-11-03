
  create table "public"."secret_santas" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "code" text not null
      );



  create table "public"."submissions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "secret_santa_id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "country" text not null
      );


CREATE UNIQUE INDEX secret_santas_code_key ON public.secret_santas USING btree (code);

CREATE UNIQUE INDEX secret_santas_pkey ON public.secret_santas USING btree (id);

CREATE UNIQUE INDEX submissions_pkey ON public.submissions USING btree (id);

alter table "public"."secret_santas" add constraint "secret_santas_pkey" PRIMARY KEY using index "secret_santas_pkey";

alter table "public"."submissions" add constraint "submissions_pkey" PRIMARY KEY using index "submissions_pkey";

alter table "public"."secret_santas" add constraint "secret_santas_code_key" UNIQUE using index "secret_santas_code_key";

alter table "public"."submissions" add constraint "submissions_secret_santa_id_fkey" FOREIGN KEY (secret_santa_id) REFERENCES secret_santas(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submissions" validate constraint "submissions_secret_santa_id_fkey";

grant delete on table "public"."secret_santas" to "anon";

grant insert on table "public"."secret_santas" to "anon";

grant references on table "public"."secret_santas" to "anon";

grant select on table "public"."secret_santas" to "anon";

grant trigger on table "public"."secret_santas" to "anon";

grant truncate on table "public"."secret_santas" to "anon";

grant update on table "public"."secret_santas" to "anon";

grant delete on table "public"."secret_santas" to "authenticated";

grant insert on table "public"."secret_santas" to "authenticated";

grant references on table "public"."secret_santas" to "authenticated";

grant select on table "public"."secret_santas" to "authenticated";

grant trigger on table "public"."secret_santas" to "authenticated";

grant truncate on table "public"."secret_santas" to "authenticated";

grant update on table "public"."secret_santas" to "authenticated";

grant delete on table "public"."secret_santas" to "service_role";

grant insert on table "public"."secret_santas" to "service_role";

grant references on table "public"."secret_santas" to "service_role";

grant select on table "public"."secret_santas" to "service_role";

grant trigger on table "public"."secret_santas" to "service_role";

grant truncate on table "public"."secret_santas" to "service_role";

grant update on table "public"."secret_santas" to "service_role";

grant delete on table "public"."submissions" to "anon";

grant insert on table "public"."submissions" to "anon";

grant references on table "public"."submissions" to "anon";

grant select on table "public"."submissions" to "anon";

grant trigger on table "public"."submissions" to "anon";

grant truncate on table "public"."submissions" to "anon";

grant update on table "public"."submissions" to "anon";

grant delete on table "public"."submissions" to "authenticated";

grant insert on table "public"."submissions" to "authenticated";

grant references on table "public"."submissions" to "authenticated";

grant select on table "public"."submissions" to "authenticated";

grant trigger on table "public"."submissions" to "authenticated";

grant truncate on table "public"."submissions" to "authenticated";

grant update on table "public"."submissions" to "authenticated";

grant delete on table "public"."submissions" to "service_role";

grant insert on table "public"."submissions" to "service_role";

grant references on table "public"."submissions" to "service_role";

grant select on table "public"."submissions" to "service_role";

grant trigger on table "public"."submissions" to "service_role";

grant truncate on table "public"."submissions" to "service_role";

grant update on table "public"."submissions" to "service_role";



alter table "public"."secret_santas" add column "currency" text not null default 'TL'::text;

alter table "public"."secret_santas" add column "maximum" integer not null default 0;

alter table "public"."secret_santas" add column "minimum" integer not null default 0;

alter table "public"."submissions" add column "address" text not null default ''::text;

alter table "public"."submissions" add column "city" text not null;

alter table "public"."submissions" add column "data_processing_consent" boolean not null;

alter table "public"."submissions" add column "delivery_instructions" text not null default '""'::text;

alter table "public"."submissions" add column "do_not_send" text not null default '""'::text;

alter table "public"."submissions" add column "i_wont_be_a_bitch" boolean not null;

alter table "public"."submissions" add column "phone_number" text not null;

alter table "public"."submissions" add column "surname" text not null;

alter table "public"."submissions" add column "willingness_for_high_shipping_fees" boolean not null;

alter table "public"."submissions" add column "wish_list" text not null default '""'::text;

CREATE UNIQUE INDEX submissions_phone_number_key ON public.submissions USING btree (phone_number);

alter table "public"."submissions" add constraint "submissions_data_processing_consent_check" CHECK ((data_processing_consent = true)) not valid;

alter table "public"."submissions" validate constraint "submissions_data_processing_consent_check";

alter table "public"."submissions" add constraint "submissions_i_wont_be_a_bitch_check" CHECK ((i_wont_be_a_bitch = true)) not valid;

alter table "public"."submissions" validate constraint "submissions_i_wont_be_a_bitch_check";

alter table "public"."submissions" add constraint "submissions_phone_number_key" UNIQUE using index "submissions_phone_number_key";



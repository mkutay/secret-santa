alter table "public"."submissions" add column "matched_to" uuid;

CREATE UNIQUE INDEX submissions_matched_to_key ON public.submissions USING btree (matched_to);

alter table "public"."submissions" add constraint "submissions_matched_to_fkey" FOREIGN KEY (matched_to) REFERENCES submissions(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."submissions" validate constraint "submissions_matched_to_fkey";

alter table "public"."submissions" add constraint "submissions_matched_to_key" UNIQUE using index "submissions_matched_to_key";



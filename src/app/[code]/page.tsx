import { SubmissionForm } from "@/components/submission-form";
import { runQuery } from "@/utils/supabase-run";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";

export default async function Home({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const result = await runQuery((s) => s.from("secret_santas").select("*, submissions(*)").eq("code", code).single());
  if (result.isErr()) return <ErrorPage error={result.error} />;
  const santa = result.value;

  return (
    <main className="flex-1">
      <div className="max-w-prose lg:max-w-6xl mx-auto px-4">
        <TypographyH1>Woo Secret Santa</TypographyH1>
        <TypographyParagraph className="mb-6 max-w-2xl">
          Aşağıdaki formu doldurarak Secret Santa etkinliğine katılabilirsiniz. Aldığınız hediyenin minimum değeri{" "}
          {santa.minimum}
          {santa.currency}, maximum değeri {santa.maximum}
          {santa.currency} olmalıdır.
        </TypographyParagraph>
        <TypographyParagraph className="mb-8 max-w-2xl italic">
          Bu etkinlik altında şu ana kadar toplam {santa.submissions.length} kişi katılmıştır.
        </TypographyParagraph>
        <SubmissionForm secretSantaId={santa.id} />
      </div>
    </main>
  );
}

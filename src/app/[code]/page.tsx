import { SubmissionForm } from "@/components/submission-form";
import { ErrorComponent } from "@/components/error-component";
import { runQuery } from "@/utils/supabase-run";

export default async function Home({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const result = await runQuery((s) => s.from("secret_santas").select("*").eq("code", code).single());
  if (result.isErr()) return <ErrorComponent error={result.error} />;
  const santa = result.value;

  return (
    <main className="flex-1">
      <div className="max-w-prose lg:max-w-6xl mx-auto flex flex-row items-center justify-between px-4">
        <SubmissionForm secretSantaId={santa.id} />
      </div>
    </main>
  );
}

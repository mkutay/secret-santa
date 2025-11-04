import { TypographyH1 } from "@/components/typography/headings";
import { env } from "@/env";
import { ErrorPage } from "@/components/error-page";
import { DoMatchingForm } from "@/components/do-matching-form";

export default async function Home({ params }: { params: Promise<{ admin: string }> }) {
  const { admin } = await params;

  if (admin !== env.ADMIN_PASSWORD) {
    return <ErrorPage error="Yönetici şifresi geçersiz." />;
  }

  return (
    <main className="flex-1">
      <div className="max-w-prose lg:max-w-6xl mx-auto px-4">
        <TypographyH1 className="mb-6">Eşleştirmeyi Başlat</TypographyH1>
        <DoMatchingForm />
      </div>
    </main>
  );
}

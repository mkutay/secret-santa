import { ThankYouImage } from "@/components/thank-you-image";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

export default async function Home() {
  return (
    <main className="flex-1">
      <div className="max-w-prose mx-auto px-4 text-center">
        <TypographyH1>Başvurunuz Alındı!</TypographyH1>
        <TypographyParagraph>
          Başvurunuz başarıyla alındı. En kısa sürede eşleştirme yapılıp size bilgi verilecektir. Katıldığınız için
          teşekkür ederiz!
        </TypographyParagraph>
        <ThankYouImage />
      </div>
    </main>
  );
}

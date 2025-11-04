import Image from "next/image";
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
        <Image src="/cat.png" width="160" height="160" alt="cat" className="mx-auto mt-6" />
      </div>
    </main>
  );
}

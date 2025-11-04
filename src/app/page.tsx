import { EnterCodeForm } from "@/components/enter-code-form";
import { SeeMatchingForm } from "@/components/see-matching-form";
import { TypographyHr } from "@/components/typography/blockquote";
import { TypographyH1, TypographyH2 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="max-w-prose lg:max-w-6xl mx-auto flex flex-col px-4">
        <TypographyH1>Çekiliş</TypographyH1>
        <TypographyParagraph className="mb-6 max-w-2xl">
          Çekilişe katılmak için size verilen kodu girin
        </TypographyParagraph>
        <EnterCodeForm />
        <TypographyHr className="my-12" />
        <TypographyH2>Hediye</TypographyH2>
        <TypographyParagraph className="mb-6 max-w-2xl">
          Kime hediye aldığınızı görmek için size verilen kodu ve oluşturduğunuz parolayı kullanarak giriş yapın.
        </TypographyParagraph>
        <SeeMatchingForm />
      </div>
    </main>
  );
}

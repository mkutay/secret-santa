import { EnterCodeForm } from "@/components/enter-code-form";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="max-w-prose lg:max-w-6xl mx-auto flex flex-row items-center justify-between px-4">
        <EnterCodeForm />
      </div>
    </main>
  );
}

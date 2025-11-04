"use client";

import { useEffect, useState } from "react";

export function ThankYouImage() {
  const [isCat, setIsCat] = useState<boolean | null>(null);

  useEffect(() => {
    setIsCat(Math.random() < 0.4);
  }, []);

  if (isCat === null) {
    return null;
  }

  return isCat ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/cat.png" width={160} height={160} alt="cat" className="mx-auto mt-6" />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/ahien.jpeg" width={160} height={160} alt="cat" className="mx-auto mt-6" />
  );
}

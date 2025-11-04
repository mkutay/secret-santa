"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TypographySmall, TypographyParagraph } from "@/components/typography/paragraph";
import { actionResultToResult } from "@/types/error-typing";
import { seeMatchingSchema } from "@/config/schemas";
import { seeMatching, type PersonInformation } from "@/server/matching";

export const SeeMatchingForm = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [matchedData, setMatchedData] = useState<PersonInformation | null>(null);

  const form = useForm<z.infer<typeof seeMatchingSchema>>({
    resolver: zodResolver(seeMatchingSchema),
    defaultValues: {
      code: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof seeMatchingSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await seeMatching(values));

      result.match(
        (data) => {
          setMatchedData(data);
        },
        (error) =>
          toast({
            title: "Başarısız",
            description: error.message,
            variant: "destructive",
          }),
      );
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <FormField
            control={form.control}
            name="code"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kod</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Size verilen özel kodu giriniz.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adınız</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Lütfen formda belirtilen adınızı girin.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parola</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>Oluşturduğunuz parolayı giriniz.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            Yapıştır
          </Button>
        </form>
      </Form>

      <Dialog open={matchedData !== null} onOpenChange={(open) => !open && setMatchedData(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Eşleşme Bilgileri</DialogTitle>
            <DialogDescription>Hediye göndereceğiniz kişinin bilgileri aşağıda yer almaktadır.</DialogDescription>
          </DialogHeader>
          {matchedData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <TypographySmall>Ad</TypographySmall>
                  <TypographyParagraph className="not-first:mt-1">{matchedData.name}</TypographyParagraph>
                </div>
                <div>
                  <TypographySmall>Soyadı</TypographySmall>
                  <TypographyParagraph className="not-first:mt-1">{matchedData.surname}</TypographyParagraph>
                </div>
                <div>
                  <TypographySmall>Ülke</TypographySmall>
                  <TypographyParagraph className="not-first:mt-1">{matchedData.country}</TypographyParagraph>
                </div>
                <div>
                  <TypographySmall>Şehir</TypographySmall>
                  <TypographyParagraph className="not-first:mt-1">{matchedData.city}</TypographyParagraph>
                </div>
              </div>
              <div>
                <TypographySmall>Adres</TypographySmall>
                <TypographyParagraph className="whitespace-pre-wrap not-first:mt-1">
                  {matchedData.address}
                </TypographyParagraph>
              </div>
              <div>
                <TypographySmall>Telefon Numarası</TypographySmall>
                <TypographyParagraph className="not-first:mt-1">{matchedData.phoneNumber}</TypographyParagraph>
              </div>
              {matchedData.deliveryInstructions ? (
                <div>
                  <TypographySmall>Teslimat Talimatları</TypographySmall>
                  <TypographyParagraph className="whitespace-pre-wrap not-first:mt-1">
                    {matchedData.deliveryInstructions}
                  </TypographyParagraph>
                </div>
              ) : null}
              {matchedData.wishList ? (
                <div>
                  <TypographySmall>İstek Listesi</TypographySmall>
                  <TypographyParagraph className="whitespace-pre-wrap not-first:mt-1">
                    {matchedData.wishList}
                  </TypographyParagraph>
                </div>
              ) : null}
              {matchedData.doNotSend ? (
                <div>
                  <TypographySmall>Gönderilmemesini İstediği Eşyalar</TypographySmall>
                  <TypographyParagraph className="whitespace-pre-wrap not-first:mt-1">
                    {matchedData.doNotSend}
                  </TypographyParagraph>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

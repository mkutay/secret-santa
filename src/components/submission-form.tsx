"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";
import { countries, createSubmissionSchema } from "@/config/schemas";
import { submission } from "@/server/submission";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/styling";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export const SubmissionForm = ({ secretSantaId }: { secretSantaId: string }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof createSubmissionSchema>>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      secretSantaId: secretSantaId,
      name: "",
      surname: "",
      address: "",
      phoneNumber: "",
      country: "",
      city: "",
      deliveryInstructions: "",
      wishList: "",
      doNotSend: "",
      password: "",
      willingnessForHighShippingFees: false,
    },
  });

  const onSubmit = (values: z.infer<typeof createSubmissionSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await submission(values));

      result.match(
        () => {
          toast({
            title: "Başarılı",
          });
          router.push("/thank-you");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
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
              <FormDescription>Lütfen adınızı girin.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyadınız</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Lütfen soyadınızı girin.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ülke</FormLabel>
              <FormControl>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                      >
                        {!field.value && "Ülke seçin..."}
                        {field.value ? field.value : null}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-0 pointer-events-auto">
                    <Command>
                      <CommandInput placeholder="Ülke seçin..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>Ülke bulunamadı.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country, index) => (
                            <CommandItem
                              value={country}
                              key={index}
                              onSelect={() => {
                                form.setValue("country", country);
                              }}
                            >
                              <span>{country}</span>
                              <Check className={cn("ml-auto", country === field.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>Gönderim ücretleri ve eşleştirme için ülkenizi girin.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şehir</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Bulunduğunuz şehir (il/ilçe). Gönderim ve eşleştirme için kullanılır.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Lütfen tam teslimat adresinizi girin (posta kodu, apartman/daire bilgisi gibi detaylar önemlidir).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon numarası</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Kargo ve iletişim için geçerli bir telefon numarası girin (örn. +90 5xx xxx xxxx).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deliveryInstructions"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teslimat talimatları</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Kurye için özel talimatlar (ör. apartman giriş şifresi, uygun teslim saatleri). Opsiyonel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wishList"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>İstek listesi</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>İstediğiniz hediyeler veya ilgi alanlarınız. Opsiyonel.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doNotSend"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gönderilmemesini istediğiniz eşyalar</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Hediyede görmek istemediğiniz şeyleri yazın (örn. alerjenler, istenmeyen kategoriler). Opsiyonel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="willingnessForHighShippingFees"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yüksek kargo ücretlerine razı mısınız?</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
              </FormControl>
              <FormDescription>
                Uluslararası eşleştirmelerde yüksek kargo ücretlerini kabul ediyorsanız işaretleyin.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataProcessingConsent"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kişisel verilerimin bu etkinlik kapsamında işlenmesini kabul ediyorum.</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
              </FormControl>
              <FormDescription>
                Kişisel verilerinizin bu etkinlik kapsamında işlenmesini kabul etmeniz gerekmektedir. Bu durumda site
                yapımcısı Kutay verilerinizi yalnızca bu etkinlik için kullanacaktır.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="IWontBeABitch"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Katılımcı olarak, etkinliğin ruhuna uygun davranacağıma ve olumsuz tutum sergilemeyeceğime söz
                veriyorum.
              </FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
              </FormControl>
              <FormDescription>
                Lütfen bu kutuyu işaretleyin. Etkinliğin keyfini çıkarmak ve pozitif bir ortam sağlamak için önemlidir.
              </FormDescription>
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
              <FormDescription>
                İnsanların birbirinin hediyelerini görmesini engellemek için bir parola girin.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Gönder
        </Button>
      </form>
    </Form>
  );
};

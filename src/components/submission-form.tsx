"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";
import { createSubmissionSchema } from "@/config/schemas";
import { submission } from "@/server/submission";

export const SubmissionForm = ({ secretSantaId }: { secretSantaId: string }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createSubmissionSchema>>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      secretSantaId: secretSantaId,
      name: "",
      country: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
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
              <FormDescription>Tam adınızı lütfen giriniz.</FormDescription>
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
                <Input {...field} />
              </FormControl>
              <FormDescription>Hangi ülkede yaşamaktasınız? Buna göre eşleşme yapmaya çalışacağız.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Yapıştır
        </Button>
      </form>
    </Form>
  );
};

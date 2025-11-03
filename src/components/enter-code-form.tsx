"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";
import { enterCodeSchema } from "@/config/schemas";
import { enterCode } from "@/server/enter-code";

export const EnterCodeForm = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof enterCodeSchema>>({
    resolver: zodResolver(enterCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof enterCodeSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await enterCode(values));

      result.match(
        (data) => {
          toast({
            title: "Başarılı",
          });
          router.push("/" + data.code);
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
        <Button type="submit" disabled={isPending}>
          Yapıştır
        </Button>
      </form>
    </Form>
  );
};

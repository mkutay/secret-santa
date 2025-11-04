"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { NumberInput } from "./ui/number-input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";
import { doMatchingSchema } from "@/config/schemas";
import { doMatching } from "@/server/do-matching";

export const DoMatchingForm = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof doMatchingSchema>>({
    resolver: zodResolver(doMatchingSchema),
    defaultValues: {
      code: "",
      seed: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof doMatchingSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await doMatching(values));

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
          name="seed"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seed</FormLabel>
              <FormControl>
                <NumberInput
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
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

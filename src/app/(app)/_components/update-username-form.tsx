"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignOutButton } from "./sign-out-button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

// 1. Create form schema.
const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function UpdateUsernameForm() {
  const router = useRouter();
  const { mutate: updateUsername, isPending } =
    api.users.updateUsername.useMutation({
      onSuccess: () => router.refresh(),
    });

  // 2. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 3. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    updateUsername({ username: values.username });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Update username</FormLabel>
              <FormControl>
                <Input placeholder="blupandaman" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>

          <SignOutButton />
        </div>
      </form>
    </Form>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/actions/user.actions";
import Image from "next/image";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const userData = {
        username: data.username,
        password: data.password,
      };

      if (type === "sign-up") {
        const response = await signUp(userData);
        if (response) {
          router.push("/");
        }
      } else if (type === "sign-in") {
        const response = await signIn({
          username: data.username,
          password: data.password,
        });
        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex justify-center gap-5">
        <Link
          href="https://mozok.de/"
          className="cursor-pointer flex items-center gap-1">
          <Image
            src="https://mozok.de/_next/static/media/mozok-logo-with-background.37b86805.svg"
            width={50}
            height={50}
            alt="Mozok Logo"
          />
        </Link>
        <strong className="text-xl">LiveCode Lab</strong>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomInput
            formControl={form.control}
            name="username"
            label="Username"
            placeholder="Enter your username"
          />
          <CustomInput
            formControl={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
          {type === "sign-up" && (
            <CustomInput
              formControl={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
            />
          )}
          <div className="flex flex-col gap-4">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Loading..
                </>
              ) : type === "sign-in" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <footer className="flex justify-center gap-1">
        <>
          <p className="text-14 font-normal text-gray-600">
            {type === "sing-in"
              ? "Don't have an account?"
              : "Already have an account? "}
          </p>
          <Link
            href={`/${type === "sign-in" ? "sign-up" : "sign-in"}`}
            className="form-link">
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </>
      </footer>
    </section>
  );
};

export default AuthForm;

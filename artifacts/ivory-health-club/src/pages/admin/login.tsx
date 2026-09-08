import { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@assets/Logo_IHC_1785932659433.png";

type AdminLoginProps = {
  onSuccess: () => void;
};

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("admin@ivoryhealthclub.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(body.error ?? "Unable to sign in.");
        return;
      }

      onSuccess();
      navigate("/admin");
    } catch {
      setError("Unable to reach the admin service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-secondary flex items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl bg-background shadow-2xl overflow-hidden">
        <div className="bg-primary px-8 py-8 text-secondary">
          <img
            src={logo}
            alt="Ivory Health Club"
            className="h-14 w-auto rounded-sm bg-white p-1 mb-6"
          />
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-semibold">
            <ShieldCheck size={16} />
            Secure admin portal
          </div>
          <h1 className="font-serif text-3xl font-bold mt-3">Welcome back</h1>
          <p className="text-secondary/75 mt-2">
            Sign in to manage Ivory Health Club.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in to admin"}
          </Button>
        </form>
      </section>
    </main>
  );
}
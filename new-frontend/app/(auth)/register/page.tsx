import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_35%),linear-gradient(to_bottom_right,hsl(var(--background)),hsl(var(--muted)/0.6))]" />
      <RegisterForm />
    </div>
  );
}

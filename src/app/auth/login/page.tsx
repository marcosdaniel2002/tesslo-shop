import LoginForm from "./ui/LoginForm";

export default function page() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className="text-4xl font-bold text-foreground mb-5">Ingresar</h1>

      <LoginForm />
    </div>
  );
}

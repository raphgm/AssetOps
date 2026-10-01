import AuthForm from "@/components/AuthForm";
export const metadata = { title: "Sign in — AssetOps" };
export const dynamic = "force-dynamic";
export default function Page() { return <AuthForm mode="sign-in" showDemo={process.env.SHOW_DEMO_HINT !== "0"} />; }

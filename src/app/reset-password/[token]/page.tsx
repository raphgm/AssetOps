import AuthForm from "@/components/AuthForm";
export default async function Page({ params }: { params: Promise<{ token: string }> }) { return <AuthForm mode="reset" token={(await params).token} />; }

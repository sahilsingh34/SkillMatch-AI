import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex w-full items-center justify-center min-h-[calc(100vh-6rem)] py-10">
            <SignIn path="/auth/login" routing="path" signUpUrl="/auth/signup" />
        </div>
    );
}

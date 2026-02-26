import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
    return (
        <div className="flex w-full items-center justify-center min-h-[calc(100vh-6rem)] py-10">
            <SignUp path="/auth/signup" routing="path" signInUrl="/auth/login" />
        </div>
    );
}

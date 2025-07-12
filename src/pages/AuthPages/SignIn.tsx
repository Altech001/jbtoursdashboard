import { SignIn } from "@clerk/clerk-react";
import AuthLayout from "./AuthPageLayout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <SignIn
          path="/signin"
          routing="path"
          signUpUrl="/signup" // Although sign-up is disabled, this is good practice
          redirectUrl="/" // Redirect to dashboard after successful sign-in
        />
      </div>
    </AuthLayout>
  );
}
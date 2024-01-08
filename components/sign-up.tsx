import Link from "next/link";

import { Icons } from "@/components/icons";
import { UserAuthForm } from "@/components/user-auth-form";

export const SignUp = () => {
    return (
        <div className="container mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <Icons.logo className="mx-auto h-6 w-6" />

                <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>

                <p className="text-sm max-w-xs mx-auto">
                    By continuing, you are setting up breadit account and agree to our user Agreement
                    and privacy policy
                </p>

                {/* sign in form */}

                <UserAuthForm />

                <p className="px-8 text-center text-sm text-zinc-700">
                    Have an account already?{' '}
                    <Link
                        href="/sign-in"
                        className="hover:text-zinc-800 text-sm underline underline-offset-4 cursor-pointer"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { SignIn } from "@/components/sign-in";
import { buttonVariants } from "@/components/ui/button";


const SignupPage: React.FC = () => {
    return (
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
                <Link
                    href={'/'}
                    className={cn(buttonVariants({ variant: 'ghost' }), 'self-start -mt-20')}
                >
                    <ChevronLeft className="mr-2 w-4 h-4" />
                    Home
                </Link>

                <SignIn />
            </div>
        </div>
    );
};

export default SignupPage;
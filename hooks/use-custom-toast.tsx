import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export const useCustomToast = () => {
    const loginToast = () => {
        const { dismiss } = toast({
            title: 'Login required.',
            description: 'You need to be logged in to complete this action.',
            variant: 'destructive',
            action: (
                <Link
                    href={'/sign-in'}
                    onClick={() => dismiss()}
                    className={buttonVariants({ variant: 'subtle' })}
                >
                    Login
                </Link>
            )
        });
    };

    return { loginToast };
};
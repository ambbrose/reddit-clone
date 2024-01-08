"use client";

import { useState } from "react";
import { signIn } from 'next-auth/react';

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { };

export const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn('google');
        } catch (error) {
            toast({
                title: 'There was a problem',
                description: 'There was an error logging with google',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <div className={cn('flex justify-center', className)} {...props}>
            <Button
                size={'sm'}
                className="w-full"
                onClick={loginWithGoogle}
                disabled={isLoading}
            >
                {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
                Google
            </Button>
        </div>
    );
};
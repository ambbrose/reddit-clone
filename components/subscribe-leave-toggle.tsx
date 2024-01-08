"use client";

import { Button } from "@/components/ui/button";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
    subredditId: string;
    subredditName: string;
    isSubscribed: boolean;
};

export const SubscribeLeaveToggle = ({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) => {

    const router = useRouter();

    const { loginToast } = useCustomToast();

    const { mutate: subscribe, isPending: isSubLaoding } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId: subredditId
            }

            const { data } = await axios.post('/api/subreddit/subscribe', payload);

            return data as string;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast()
                };
            };

            return toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'Something went wrong, please try again.'
            });
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            });

            return toast({
                variant: 'default',
                title: 'Subscribed to subreddit',
                description: `You are now subscribed to r/${subredditName}`,
                className: 'bg-green-500 text-white'
            })
        },
    });

    const { mutate: unSubscribe, isPending: isUnsubLaoding } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId: subredditId
            }

            const { data } = await axios.post('/api/subreddit/unsubscribe', payload);

            return data as string;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast()
                };
            };

            return toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'Something went wrong, please try again.'
            });
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            });

            return toast({
                variant: 'default',
                title: 'Unsubscribed to subreddit',
                description: `You are now unsubscribed to r/${subredditName}`,
                className: 'bg-green-500 text-white'
            })
        },
    });

    return isSubscribed ? (
        <Button
            isLoading={isUnsubLaoding}
            onClick={() => unSubscribe()}
            className="w-full mb-4 mt-1"
        >
            Leave Community
        </Button>
    ) : (
        <Button
            isLoading={isSubLaoding}
            onClick={() => subscribe()}
            className="w-full mb-4 mt-1"
        >
            Join to post
        </Button>
    )
};
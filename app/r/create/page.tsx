"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/components/ui/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const Createpage = () => {

    const router = useRouter();

    const [input, setInput] = useState<string>('');

    const { loginToast } = useCustomToast();

    const { mutate: createCommunity, isPending } = useMutation({
        mutationFn: async () => {
            const payload: CreateSubredditPayload = {
                name: input
            };

            const { data } = await axios.post('/api/subreddit', payload);

            return data as string;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    return toast({
                        title: 'Subreddit already exists.',
                        description: 'Please choose a different subreddit name.',
                        variant: 'destructive'
                    });
                };

                if (error.response?.status === 422) {
                    return toast({
                        title: 'Invalid Subreddit name.',
                        description: 'Please choose a name between 3 to 21 characters.',
                        variant: 'destructive'
                    });
                };

                if (error.response?.status === 401) {
                    return loginToast();
                };
            };

            toast({
                title: 'Uh oh! Something went wrong.',
                description: 'Could not create subreddit.',
                variant: 'destructive'
            })
        },
        onSuccess: (data) => {
            toast({
                description: 'Subreddit Created Successfully.!!!',
                variant: 'default',
                className: 'bg-green-500 text-white font-semibold'
            })
            router.push(`/r/${data}`);
        },
    });

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Create a community</h1>
                </div>

                <hr className="bg-zinc-500 h-px" />

                <div className="space-y-2">
                    <p className="text-lg font-medium">Name</p>
                    <p className="text-xs pb-2">
                        Community names including capitalization cannot be changed.
                    </p>

                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center">
                            r/
                        </p>

                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="pl-6"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        variant={'subtle'}
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>

                    <Button
                        isLoading={isPending}
                        disabled={input.length === 0}
                        onClick={() => createCommunity()}
                    >
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Createpage;
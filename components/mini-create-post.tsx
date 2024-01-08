"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { ImageIcon, Link2 } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export const MiniCreatePost = ({ session }: { session: Session | null }) => {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <li className="overflow-hidden rounded-md bg-white shadow">
            <div className="h-full px-6 py-4 flex justify-between gap-6">
                <div className="relative">
                    <UserAvatar
                        user={{
                            name: session?.user.name || null,
                            image: session?.user.image || null
                        }}
                    />

                    <span
                        className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white"
                    />
                </div>

                <Input
                    readOnly
                    placeholder="Create Post"
                    onClick={() => router.push(pathname + '/submit')}
                />

                <Button
                    variant={'ghost'}
                    onClick={() => router.push(pathname + '/submit')}
                >
                    <ImageIcon className="text-zinc-600" />
                </Button>

                <Button
                    variant={'ghost'}
                    onClick={() => router.push(pathname + '/submit')}
                >
                    <Link2 className="text-zinc-600" />
                </Button>
            </div>
        </li>
    );
};
"use client"; 

import { User } from "next-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
    user: Pick<User, 'name' | 'email' | 'image'>
};

export const UserAccountNav = ({ user }: UserAccountNavProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    className="h-8 w-8"
                    user={{
                        name: user.name || null,
                        image: user.image || null
                    }}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white">
                <div className="flex items-center justify-center gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email &&
                            <p className="truncate text-zinc-700 text-sm w-[200px]">
                                {user.email}
                            </p>}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={'/'}>Feed</Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                    <Link href={'/r/create'}>Create community</Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                    <Link href={'/settings'}>Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                    className="cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault();
                        signOut({callbackUrl: `${window.location.origin}/sign-in`})
                    }}
                >
                    Signout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";


export const CloseModal = () => {
    const router = useRouter();

    return (
        <Button
            aria-label="close modal"
            variant={'subtle'}
            className="h-6 w-6 p-0 rounded-md"
            onClick={() => router.back()}
        >
            <X className="w-4 h-4" />
        </Button>
    );
};
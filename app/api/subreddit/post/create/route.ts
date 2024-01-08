import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse("Unauthorise", { status: 401 });
        };

        const body = await req.json();

        const { subredditId, title, content } = PostValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId: subredditId,
                userId: session.user.id
            }
        });

        if (!subscriptionExists) {
            return new NextResponse("You are not subscribed to this subreddit.", { status: 400 })
        };

        await db.post.create({
            data: {
                title: title,
                content: content,
                subredditId: subredditId,
                authorId: session.user.id
            }
        });


        return NextResponse.json("OK");

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data passed", { status: 422 });
        };

        console.log('SUBREDDIT-POST-CREATION-ERROR:-', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
};
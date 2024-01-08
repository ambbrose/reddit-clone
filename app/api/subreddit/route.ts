import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse("Unauthorised", { status: 401 })
        };

        const body = await req.json();
        const { name } = SubredditValidator.parse(body);

        const subredditExists = await db.subreddit.findFirst({
            where: {
                name: name
            }
        });

        if (subredditExists) {
            return new NextResponse("Subreddit already exists", { status: 409 });
        };

        const subreddit = await db.subreddit.create({
            data: {
                name: name,
                creatorId: session.user.id
            }
        });

        await db.subscription.create({
            data: {
                userId: session.user.id,
                subredditId: subreddit.id
            }
        });

        return NextResponse.json(subreddit.name);

    } catch (error) {

        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        };

        console.log('SUBREDDIT-CREATE-ERROR:-', error);
        return new NextResponse('Internal server error', { status: 500 });
    };
};
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse("Unauthorise", { status: 401 });
        };

        const body = await req.json();

        const { subredditId } = SubredditSubscriptionValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId: subredditId,
                userId: session.user.id
            }
        });

        if (!subscriptionExists) {
            return new NextResponse("You are already not subscribed to this subreddit.", { status: 400 })
        };

        const isOwnSubreddit = await db.subreddit.findFirst({
            where: {
                id: subredditId,
                creatorId: session.user.id
            }
        });

        if (isOwnSubreddit) {
            return new NextResponse("You can't unsubscribe toyour own subreddit.", { status: 400 });
        };

        await db.subscription.delete({
            where: {
                id: subscriptionExists.id,
                userId: session.user.id,
                subredditId: subredditId
            },
        });

        return NextResponse.json(subredditId);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data passed", { status: 422 });
        };

        console.log('SUBREDDIT-UNSUBSCRIPTION-ERROR:-', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
};
import { z } from 'zod';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
    const url = new URL(req.url);

    const session = await getAuthSession();

    let followedCommunitiesIds: string[] = [];

    if (session) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                subreddit: true,
            },
        });

        // GET THE IDs OF ALL THE SUBREDDIT THE LOGGED IN USER IS SUBSCRIBED TO
        followedCommunitiesIds = followedCommunities.map((sub) => sub.subreddit.id);
    };

    try {
        const { limit, page, subredditName } = z
            .object({
                limit: z.string(),
                page: z.string(),
                subredditName: z.string().nullish().optional(),
            })
            .parse({
                subredditName: url.searchParams.get('subredditName'),
                limit: url.searchParams.get('limit'),
                page: url.searchParams.get('page'),
            });

        let whereClause = {};

        if (subredditName) {
            // GET THE POST THAT BELONGS TO THE SUBREDDIT WITH THE NAME PROVIDED
            whereClause = {
                subreddit: {
                    name: subredditName,
                },
            }
        } else if (session) {
            // GET THE POST THAT BELONGS TO THE SUBREDDIT THAT THE LOGGED IN USER BELONGS TO
            whereClause = {
                subreddit: {
                    id: {
                        in: followedCommunitiesIds,
                    },
                },
            };
        };

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                subreddit: true,
                votes: true,
                author: true,
                comments: true,
            },
            where: whereClause,
        });

        return new NextResponse(JSON.stringify(posts));
    } catch (error) {
        return new NextResponse('Could not fetch posts', { status: 500 });
    };
};
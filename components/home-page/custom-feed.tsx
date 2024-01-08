import { notFound } from 'next/navigation';

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostFeed } from '@/components/post-feed';

const CustomFeed = async () => {
    const session = await getAuthSession()

    // only rendered if session exists, so this will not happen
    if (!session) return notFound()

    // get the subreddit the logged in user is a member of
    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            subreddit: true,
        },
    })

    //get the post that belongs to the subreddit the logged in user is a member of
    const posts = await db.post.findMany({
        where: {
            subreddit: {
                name: {
                    in: followedCommunities.map((sub) => sub.subreddit.name),
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            subreddit: true,
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
    })

    return <PostFeed initialPosts={posts} />
}

export default CustomFeed
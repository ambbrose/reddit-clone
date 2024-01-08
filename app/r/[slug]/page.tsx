import { notFound } from "next/navigation";

import { MiniCreatePost } from "@/components/mini-create-post";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostFeed } from "@/components/post-feed";

interface SubredditPageProps {
    params: {
        slug: string;
    }
};

const SubredditPage = async ({ params }: SubredditPageProps) => {

    const session = await getAuthSession();

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: params.slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: INFINITE_SCROLL_PAGINATION_RESULTS
            }
        }
    });

    if (!subreddit) {
        return notFound();
    };

    return (
        <>
            <h1 className="font-bold text-3xl md:text-4xl mb-2">
                r/{subreddit.name}
            </h1>

            <MiniCreatePost session={session} />

            {/* TODO: show posts in user feed */}
            <PostFeed 
                subredditName={subreddit.name}
                initialPosts={subreddit.posts}
            />
        </>
    );
};

export default SubredditPage;
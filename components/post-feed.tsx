"use client";

import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useIntersection } from "@mantine/hooks";
import { useSession } from 'next-auth/react';

import { ExtendedPost } from "@/types/db";
import { usePostFeedQuery } from "@/hooks/use-post-feed";
import Post from "@/components/post";

interface PostFeedProps {
    initialPosts: ExtendedPost[];
    subredditName?: string;
};

export const PostFeed = ({ initialPosts, subredditName }: PostFeedProps) => {

    const { data: session } = useSession();
    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    });

    const { data, isFetchingNextPage, fetchNextPage } = usePostFeedQuery({
        apiUrl: '/api/posts',
        initialPosts: initialPosts,
        subredditName: subredditName
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage() // Load more posts when the last post comes into view
        }
    }, [entry, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

    return (
        <ul className='flex flex-col col-span-2 space-y-6'>
            {posts.map((post, index) => {
                const votesAmt = post.votes.reduce((acc, vote) => {
                    if (vote.type === 'UP') return acc + 1
                    if (vote.type === 'DOWN') return acc - 1
                    return acc
                }, 0);

                const currentVote = post.votes.find(
                    (vote) => vote.userId === session?.user.id
                );

                if (index === posts.length - 1) {
                    // Add a ref to the last post in the list
                    return (
                        <li key={post.id} ref={ref}>
                            <Post
                                post={post}
                                votesAmt={votesAmt}
                                currentVote={currentVote}
                                commentAmt={post.comments.length}
                                subredditName={post.subreddit.name}
                            />
                        </li>
                    )
                } else {
                    return (
                        <Post
                            key={post.id}
                            post={post}
                            votesAmt={votesAmt}
                            currentVote={currentVote}
                            commentAmt={post.comments.length}
                            subredditName={post.subreddit.name}
                        />
                    )
                }
            })}

            {isFetchingNextPage && (
                <li className='flex justify-center'>
                    <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
                </li>
            )}
        </ul>
    );
};
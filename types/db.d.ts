import { Comment, Post, PostVote, Subreddit, User } from "@prisma/client";

export type ExtendedPost = Post & {
    subreddit: Subreddit,
    votes: PostVote[],
    author: User,
    comments: Comment[]
};
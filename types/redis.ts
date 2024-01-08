import { PostVote } from '@prisma/client';

export type CachedPost = {
  id: string
  title: string
  authorUsername: string
  content: string
  currentVote: PostVote['type'] | null
  createdAt: Date
};
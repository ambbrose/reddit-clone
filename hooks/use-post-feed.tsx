import axios from "axios";
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { ExtendedPost } from "@/types/db";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";


interface PostFeedQueryProps {
    subredditName: string | undefined;
    apiUrl: string;
    initialPosts: ExtendedPost[];
};

export const usePostFeedQuery = ({ subredditName, apiUrl, initialPosts }: PostFeedQueryProps) => {

    const queryFunction = async ({ pageParam = 1 }) => {

        const query = `${apiUrl}?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` + (!!subredditName ? `&subredditName=${subredditName}` : '');

        const { data } = await axios.get(query);

        return data as ExtendedPost[];
    };

    const {
        fetchNextPage,
        isFetchingNextPage,
        data,
    } = useInfiniteQuery({
        queryKey: ['inifite-query'],
        queryFn: queryFunction,
        getNextPageParam: (_, pages) => { return pages.length + 1 },
        initialPageParam: 1,
        initialData: {
            pages: [initialPosts],
            pageParams: [1],
        },
    })

    return {
        data,
        isFetchingNextPage,
        fetchNextPage
    };
};
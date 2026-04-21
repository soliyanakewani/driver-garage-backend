export type PostFeedFilter = 'all' | 'mine' | 'favorites' | 'bookmarks';

export interface GetPostsDto {
    page: number;
    limit: number;
    viewerId: string;
    /** Search title + content (case-insensitive substring), same pattern as many feed apps. */
    q?: string;
    filter?: PostFeedFilter;
}

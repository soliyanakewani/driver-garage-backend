export interface Post {
    id: string;
    title: string | null;
    authorId: string;
    imageUrl?: string;
    imageUrls?: string[];
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PostAuthorSummary {
    id: string;
    firstName: string;
    lastName: string;
}

export interface PostFeedItem {
    id: string;
    /** Optional short headline; UI can default to first line of content when null. */
    title: string | null;
    content: string;
    /** All image URLs (legacy single `imageUrl` merged in for older rows). */
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    author: PostAuthorSummary;
    stats: {
        likeCount: number;
        commentCount: number;
        bookmarkCount: number;
    };
    isLikedByMe: boolean;
    isBookmarkedByMe: boolean;
}

export interface PostCommentView {
    id: string;
    postId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: PostAuthorSummary;
    isMine: boolean;
}

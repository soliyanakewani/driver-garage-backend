export interface Post {
    id: string;
    title: string;
    authorId: string;
    imageUrl?: string;
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
    title: string;
    content: string;
    imageUrl?: string;
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

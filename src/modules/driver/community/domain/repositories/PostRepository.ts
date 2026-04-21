import { PostCommentView, PostFeedItem } from "../types/Post";
import type { PostFeedFilter } from "../../application/dtos/GetPostsDto";

export interface PostRepository {
    createPost(post: {
        authorId: string;
        title?: string;
        content: string;
        imageUrl?: string;
        imageUrls?: string[];
    }): Promise<void>;

    findAll(
        page: number,
        limit: number,
        viewerId: string,
        options?: { q?: string; filter?: PostFeedFilter }
    ): Promise<PostFeedItem[]>;
    findBookmarked(viewerId: string, page: number, limit: number): Promise<PostFeedItem[]>;

    updatePost(
        postId: string,
        title?: string,
        content?: string,
        authorId?: string,
        imageUrl?: string,
        imageUrls?: string[]
    ): Promise<void>;

    deletePost(postId: string, authorId: string): Promise<void>;

    toggleLike(postId: string, driverId: string): Promise<{ liked: boolean; likeCount: number }>;
    toggleBookmark(postId: string, driverId: string): Promise<{ bookmarked: boolean }>;
    reportPost(
        postId: string,
        reporterId: string,
        reason: string,
        details?: string
    ): Promise<{
        id: string;
        postId: string;
        reporterId: string;
        reason: string;
        details?: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createComment(postId: string, driverId: string, content: string): Promise<PostCommentView>;
    listComments(postId: string, viewerId: string): Promise<PostCommentView[]>;
    deleteComment(postId: string, commentId: string, driverId: string): Promise<void>;
}

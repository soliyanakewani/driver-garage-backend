import { PrismaClient } from "@prisma/client";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { PostCommentView, PostFeedItem } from "../../domain/types/Post";

const prisma = new PrismaClient();

export class PrismaPostRepository implements PostRepository {
    private mapFeedItem(raw: {
        id: string;
        title: string;
        content: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        author: { id: string; firstName: string; lastName: string };
        _count: { likes: number; comments: number; bookmarks: number };
        likes: { id: string }[];
        bookmarks: { id: string }[];
    }): PostFeedItem {
        return {
            id: raw.id,
            title: raw.title,
            content: raw.content,
            imageUrl: raw.imageUrl ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            author: raw.author,
            stats: {
                likeCount: raw._count.likes,
                commentCount: raw._count.comments,
                bookmarkCount: raw._count.bookmarks,
            },
            isLikedByMe: raw.likes.length > 0,
            isBookmarkedByMe: raw.bookmarks.length > 0,
        };
    }

    async findAll(page: number, limit: number, viewerId: string): Promise<PostFeedItem[]> {
       const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
            author: {
                select: { id: true, firstName: true, lastName: true },
            },
            _count: {
                select: { likes: true, comments: true, bookmarks: true },
            },
            likes: {
                where: { driverId: viewerId },
                select: { id: true },
            },
            bookmarks: {
                where: { driverId: viewerId },
                select: { id: true },
            },
        },
       });

       return posts.map((post) => this.mapFeedItem(post));
    }

    async findBookmarked(viewerId: string, page: number, limit: number): Promise<PostFeedItem[]> {
        const bookmarks = await prisma.postBookmark.findMany({
            where: { driverId: viewerId },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                post: {
                    include: {
                        author: {
                            select: { id: true, firstName: true, lastName: true },
                        },
                        _count: {
                            select: { likes: true, comments: true, bookmarks: true },
                        },
                        likes: {
                            where: { driverId: viewerId },
                            select: { id: true },
                        },
                        bookmarks: {
                            where: { driverId: viewerId },
                            select: { id: true },
                        },
                    },
                },
            },
        });

        return bookmarks.map((item) => this.mapFeedItem(item.post));
    }

    async createPost(data: {
        title: string;
        content: string;
        authorId: string;
        imageUrl?: string;
    }): Promise<void> {

        await prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                authorId: data.authorId,
                imageUrl: data.imageUrl
            },
        });

    }


    async updatePost(
        postId: string, 
        title?: string, 
        content?: string, 
        authorId?: string, 
        imageUrl?: string
    ): Promise<void> {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post || post.authorId !== authorId) {
            throw new Error("Post not found or unauthorized");
        }

        await prisma.post.update({
            where: { id: postId },
            data: {
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                ...(imageUrl !== undefined && { imageUrl }),     
            },
        });
    }

    async deletePost(postId: string, authorId: string): Promise<void> {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post || post.authorId !== authorId) {
            throw new Error("Post not found or unauthorized");
        }

        await prisma.post.delete({
            where: { id: postId },
        });
    }

    async toggleLike(postId: string, driverId: string): Promise<{ liked: boolean; likeCount: number }> {
        const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
        if (!post) throw new Error("Post not found");

        const existing = await prisma.postLike.findUnique({
            where: { postId_driverId: { postId, driverId } },
            select: { id: true },
        });

        if (existing) {
            await prisma.postLike.delete({
                where: { postId_driverId: { postId, driverId } },
            });
        } else {
            await prisma.postLike.create({
                data: { postId, driverId },
            });
        }

        const likeCount = await prisma.postLike.count({ where: { postId } });
        return { liked: !existing, likeCount };
    }

    async toggleBookmark(postId: string, driverId: string): Promise<{ bookmarked: boolean }> {
        const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
        if (!post) throw new Error("Post not found");

        const existing = await prisma.postBookmark.findUnique({
            where: { postId_driverId: { postId, driverId } },
            select: { id: true },
        });

        if (existing) {
            await prisma.postBookmark.delete({
                where: { postId_driverId: { postId, driverId } },
            });
            return { bookmarked: false };
        }

        await prisma.postBookmark.create({ data: { postId, driverId } });
        return { bookmarked: true };
    }

    async reportPost(postId: string, reporterId: string, reason: string, details?: string): Promise<{
        id: string;
        postId: string;
        reporterId: string;
        reason: string;
        details?: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }> {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { id: true, authorId: true },
        });
        if (!post) throw new Error("Post not found");
        if (post.authorId === reporterId) {
            throw new Error("You cannot report your own post");
        }

        const report = await prisma.postReport.upsert({
            where: { postId_reporterId: { postId, reporterId } },
            update: {
                reason,
                details: details ?? null,
                status: "PENDING",
            },
            create: {
                postId,
                reporterId,
                reason,
                details: details ?? null,
                status: "PENDING",
            },
        });

        return {
            id: report.id,
            postId: report.postId,
            reporterId: report.reporterId,
            reason: report.reason,
            details: report.details ?? undefined,
            status: report.status,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
        };
    }

    async createComment(postId: string, driverId: string, content: string): Promise<PostCommentView> {
        const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
        if (!post) throw new Error("Post not found");

        const comment = await prisma.postComment.create({
            data: { postId, driverId, content },
            include: {
                driver: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        return {
            id: comment.id,
            postId: comment.postId,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            author: comment.driver,
            isMine: true,
        };
    }

    async listComments(postId: string, viewerId: string): Promise<PostCommentView[]> {
        const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
        if (!post) throw new Error("Post not found");

        const comments = await prisma.postComment.findMany({
            where: { postId },
            orderBy: { createdAt: "asc" },
            include: {
                driver: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        return comments.map((comment) => ({
            id: comment.id,
            postId: comment.postId,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            author: comment.driver,
            isMine: comment.driverId === viewerId,
        }));
    }

    async deleteComment(postId: string, commentId: string, driverId: string): Promise<void> {
        const comment = await prisma.postComment.findUnique({
            where: { id: commentId },
            select: { id: true, postId: true, driverId: true },
        });

        if (!comment || comment.postId !== postId) {
            throw new Error("Comment not found");
        }
        if (comment.driverId !== driverId) {
            throw new Error("Unauthorized");
        }

        await prisma.postComment.delete({ where: { id: commentId } });
    }

}
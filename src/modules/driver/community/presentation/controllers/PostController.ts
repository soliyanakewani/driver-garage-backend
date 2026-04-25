import { Request, Response } from "express";
import { PrismaPostRepository } from "../../infrastructure/prisma/PrismaRepoitory"
import { CreatePostUseCase } from "../../application/usecases/CreatePostUseCase";
import { EditPostUseCase } from "../../application/usecases/EditPostUseCase";
import { DeletePostUseCase } from "../../application/usecases/DeletePostUseCase";
import { GetPostsUseCase } from "../../application/usecases/GetPostsUseCase";
import { TogglePostLikeUseCase } from "../../application/usecases/TogglePostLikeUseCase";
import { TogglePostBookmarkUseCase } from "../../application/usecases/TogglePostBookmarkUseCase";
import { CreatePostCommentUseCase } from "../../application/usecases/CreatePostCommentUseCase";
import { ListPostCommentsUseCase } from "../../application/usecases/ListPostCommentsUseCase";
import { DeletePostCommentUseCase } from "../../application/usecases/DeletePostCommentUseCase";
import { GetBookmarkedPostsUseCase } from "../../application/usecases/GetBookmarkedPostsUseCase";
import { ReportPostUseCase } from "../../application/usecases/ReportPostUseCase";
import type { PostFeedFilter } from "../../application/dtos/GetPostsDto";

const repo = new PrismaPostRepository();
const getPostsUseCase = new GetPostsUseCase(repo);
const createPostUseCase = new CreatePostUseCase(repo);
const editPostUseCase = new EditPostUseCase(repo);
const deletePostUseCase = new DeletePostUseCase(repo);
const togglePostLikeUseCase = new TogglePostLikeUseCase(repo);
const togglePostBookmarkUseCase = new TogglePostBookmarkUseCase(repo);
const createPostCommentUseCase = new CreatePostCommentUseCase(repo);
const listPostCommentsUseCase = new ListPostCommentsUseCase(repo);
const deletePostCommentUseCase = new DeletePostCommentUseCase(repo);
const getBookmarkedPostsUseCase = new GetBookmarkedPostsUseCase(repo);
const reportPostUseCase = new ReportPostUseCase(repo);

function parseFeedFilter(raw: unknown): PostFeedFilter | undefined {
    const v = String(raw ?? "")
        .trim()
        .toLowerCase();
    if (!v || v === "all") return undefined;
    if (v === "mine" || v === "favorites" || v === "bookmarks") return v;
    throw new Error("filter must be all, mine, favorites, or bookmarks");
}

function parseImageUrlsBody(body: Record<string, unknown>): string[] | undefined {
    if (body.imageUrls === undefined) return undefined;
    if (Array.isArray(body.imageUrls)) {
        return body.imageUrls.map((u) => String(u).trim()).filter(Boolean);
    }
    const single = String(body.imageUrls).trim();
    return single ? [single] : [];
}

function mergeImageUrls(uploaded: string[], bodyUrls?: string[]): string[] | undefined {
    const merged = [...uploaded, ...(bodyUrls ?? [])].filter(Boolean);
    const unique = [...new Set(merged)];
    return unique.length ? unique : undefined;
}
export class PostController {

    static async getPosts(req: Request, res: Response) {
        try {
            const filter = parseFeedFilter(req.query.filter);
            const dto = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                viewerId: req.user!.id,
                q: req.query.q != null ? String(req.query.q) : undefined,
                filter,
            };
            const posts = await getPostsUseCase.execute(dto);
            res.json(posts);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getBookmarkedPosts(req: Request, res: Response) {
        try {
            const dto = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                viewerId: req.user!.id,
            };
            const posts = await getBookmarkedPostsUseCase.execute(dto);
            res.json(posts);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async createPost(req: Request, res: Response) {
        try {
            const body = req.body as Record<string, unknown>;
            const files = req.files as Express.Multer.File[];
            const uploadedUrls = files?.map(
                (file) => `/uploads/${file.filename}`
            ) || [];
            const bodyUrls = parseImageUrlsBody(body);
            const imageUrls = mergeImageUrls(uploadedUrls, bodyUrls);
            const dto = {
                title: body.title != null ? String(body.title) : undefined,
                content: String(body.content ?? ""),
                imageUrl: body.imageUrl != null ? String(body.imageUrl) : undefined,
                imageUrls,
                authorId: req.user!.id,
            };
            await createPostUseCase.execute(dto);
            res.json({ message: "Post created successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }

    }

    static async editPost(req: Request, res: Response) {
        try {
            const body = req.body as Record<string, unknown>;
            const files = req.files as Express.Multer.File[];
            const uploadedUrls = files?.map(
                (file) => `/uploads/${file.filename}`
            ) || [];
            const bodyUrls = parseImageUrlsBody(body);
            const imageUrls = mergeImageUrls(uploadedUrls, bodyUrls);
            const dto = {
                postId: String(req.params.id),
                title: body.title !== undefined ? String(body.title) : undefined,
                content: body.content !== undefined ? String(body.content) : undefined,
                imageUrl: body.imageUrl !== undefined ? String(body.imageUrl) : undefined,
                imageUrls,
                authorId: req.user!.id,
            };

            await editPostUseCase.execute(dto);
            res.json({ message: "Post updated successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async deletePost(req: Request, res: Response) {
        try {
            const dto = {
                postId: String(req.params.id),
                authorId: req.user!.id,
            };

            await deletePostUseCase.execute(dto);
            res.json({ message: "Post deleted successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async toggleLike(req: Request, res: Response) {
        try {
            const response = await togglePostLikeUseCase.execute({
                postId: String(req.params.id),
                driverId: req.user!.id,
            });
            res.json(response);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async toggleBookmark(req: Request, res: Response) {
        try {
            const response = await togglePostBookmarkUseCase.execute({
                postId: String(req.params.id),
                driverId: req.user!.id,
            });
            res.json(response);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getComments(req: Request, res: Response) {
        try {
            const comments = await listPostCommentsUseCase.execute({
                postId: String(req.params.id),
                viewerId: req.user!.id,
            });
            res.json(comments);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async createComment(req: Request, res: Response) {
        try {
            const comment = await createPostCommentUseCase.execute({
                postId: String(req.params.id),
                driverId: req.user!.id,
                content: String(req.body.content ?? ""),
            });
            res.status(201).json(comment);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async deleteComment(req: Request, res: Response) {
        try {
            await deletePostCommentUseCase.execute({
                postId: String(req.params.id),
                commentId: String(req.params.commentId),
                driverId: req.user!.id,
            });
            res.status(204).send();
        } catch (err: any) {
            const status = err.message === "Unauthorized" ? 403 : 400;
            res.status(status).json({ error: err.message });
        }
    }

    static async reportPost(req: Request, res: Response) {
        try {
            const report = await reportPostUseCase.execute({
                postId: String(req.params.id),
                reporterId: req.user!.id,
                reason: String(req.body.reason ?? ""),
                details: req.body.details ? String(req.body.details) : undefined,
            });
            res.status(201).json(report);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

}
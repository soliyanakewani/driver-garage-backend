import { Request, Response } from "express";
import { PrismaPostRepository } from "../../infrastructure/prisma/PrismaRepoitory"
import { CreatePostUseCase } from "../../application/usecases/CreatePostUseCase";
import { EditPostUseCase } from "../../application/usecases/EditPostUseCase";
import { DeletePostUseCase } from "../../application/usecases/DeletePostUseCase";
import { GetPostsUseCase } from "../../application/usecases/GetPostsUseCase";

const repo = new PrismaPostRepository();
<<<<<<< Updated upstream

=======
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

/* function parseImageUrlsBody(body: Record<string, unknown>): string[] | undefined {
    if (body.imageUrls === undefined) return undefined;
    if (Array.isArray(body.imageUrls)) {
        return body.imageUrls.map((u) => String(u).trim()).filter(Boolean);
    }
    const single = String(body.imageUrls).trim();
    return single ? [single] : [];
}
*/
>>>>>>> Stashed changes
export class PostController {

    static async getPosts(req: Request, res: Response) {
        try {
            const useCase = new GetPostsUseCase(repo);

            const dto = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
            };
            const posts = await useCase.execute(dto);
            res.json(posts);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async createPost(req: Request, res: Response) {
        try {
<<<<<<< Updated upstream
            const useCase = new CreatePostUseCase(repo);

            const dto = {
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.body.imageUrl,
                authorId: req.user!.id,
            }
            await useCase.execute(dto);
=======
            const files = req.files as Express.Multer.File[];

            const imageUrls = files?.map(
                (file) => `/uploads/${file.filename}`
            ) || [];
            const dto = {
                title: req.body.title != null ? String(req.body.title) : undefined,
                content: String(req.body.content ?? ""),
                imageUrls,
                authorId: req.user!.id,
            };
            await createPostUseCase.execute(dto);
>>>>>>> Stashed changes
            res.json({ message: "Post created successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }

    }

    static async editPost(req: Request, res: Response) {
        try {
<<<<<<< Updated upstream
            const useCase = new EditPostUseCase(repo);

            const dto = {
                postId: String(req.params.id),
                title: req.body.title,
=======
            const files = req.files as Express.Multer.File[];

            const imageUrls = files?.map(
                (file) => `/uploads/${file.filename}`
            ) || [];
            const dto = {
                postId: String(req.params.id),
                title: req.body.title !== undefined ? String(req.body.title) : undefined,
                content: req.body.content !== undefined ? String(req.body.content) : undefined,
                imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
>>>>>>> Stashed changes
                authorId: req.user!.id,

            };

            await useCase.execute(dto);
            res.json({ message: "Post updated successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async deletePost(req: Request, res: Response) {
        try {
            const useCase = new DeletePostUseCase(repo);

            const dto = {
                postId: String(req.params.id),
                authorId: req.user!.id,
            };

            await useCase.execute(dto);
            res.json({ message: "Post deleted successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

}
import { Request, Response } from "express";
import { PrismaPostRepository } from "../../infrastructure/prisma/PrismaRepoitory"
import { CreatePostUseCase } from "../../application/usecases/CreatePostUseCase";
import { EditPostUseCase } from "../../application/usecases/EditPostUseCase";
import { DeletePostUseCase } from "../../application/usecases/DeletePostUseCase";
import { GetPostsUseCase } from "../../application/usecases/GetPostsUseCase";

const repo = new PrismaPostRepository();

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
            const useCase = new CreatePostUseCase(repo);

            const dto = {
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.body.imageUrl,
                authorId: req.user!.id,
            }
            await useCase.execute(dto);
            res.json({ message: "Post created successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }

    }

    static async editPost(req: Request, res: Response) {
        try {
            const useCase = new EditPostUseCase(repo);

            const dto = {
                postId: String(req.params.id),
                title: req.body.title,
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
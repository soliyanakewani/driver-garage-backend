import { PrismaClient } from "@prisma/client";
import { PostRepository } from "../../domain/repositories/PostRepository";

const prisma = new PrismaClient();

export class PrismaPostRepository implements PostRepository {

    async findAll(page: number, limit: number): Promise<any[]> {
       const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
        
       });

       return posts;
    }
    
    
    async createPost(data: {
        title: string;
        content: string;
        authorId: string;
        imageUrl?: string;
    }): Promise<any> {

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
    ): Promise<any> {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post || post.authorId !== authorId) {
            throw new Error("Post not found or unauthorized");
        }

        return await prisma.post.update({
            where: { id: postId },
            data: {
                content     
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

}
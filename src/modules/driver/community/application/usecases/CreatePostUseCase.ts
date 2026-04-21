import { PostRepository } from "../../domain/repositories/PostRepository";
import { CreatePostDto } from "../dtos/CreatePostDto";

export class CreatePostUseCase {
    constructor(private postRepository: PostRepository) {} 

    async execute(dto: CreatePostDto): Promise<void> {
        if (!dto.title || !dto.content || !dto.authorId) {
            throw new Error("Title, content and authorId are required");
        }
        
        await this.postRepository.createPost({
            ...dto,
            title: dto.title.trim(),
            content: dto.content.trim(),
            imageUrl: dto.imageUrl?.trim() || undefined,
        });
    }
}
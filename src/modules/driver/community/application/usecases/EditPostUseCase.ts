import { PostRepository } from "../../domain/repositories/PostRepository";
import { EditPostDto } from "../dtos/EditPostDto";

export class EditPostUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(dto: EditPostDto): Promise<void> {
        if (!dto.postId || !dto.authorId) throw new Error("postId and authorId are required");
        if (!dto.title && !dto.content && !dto.imageUrl) {
            throw new Error("At least one field must be provided");
        }

        await this.postRepository.updatePost(
            dto.postId, 
            dto.title?.trim(), 
            dto.content?.trim(), 
            dto.authorId,
            dto.imageUrl?.trim()
        );
    }
}
import { PostRepository } from "../../domain/repositories/PostRepository";
import { EditPostDto } from "../dtos/EditPostDto";

export class EditPostUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(dto: EditPostDto): Promise<any> {

        await this.postRepository.updatePost(
            dto.postId, 
            dto.title, 
            dto.content, 
            dto.authorId
        );
    }
}
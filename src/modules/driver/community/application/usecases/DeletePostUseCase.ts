import { PostRepository } from "../../domain/repositories/PostRepository";
import { DeletePostDto } from "../dtos/DeletePostDto";

export class DeletePostUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(dto: DeletePostDto): Promise<void> {
        await this.postRepository.deletePost(dto.postId, dto.authorId);
    }
}
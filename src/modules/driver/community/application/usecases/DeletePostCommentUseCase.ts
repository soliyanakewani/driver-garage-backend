import { PostRepository } from "../../domain/repositories/PostRepository";
import { DeletePostCommentDto } from "../dtos/DeletePostCommentDto";

export class DeletePostCommentUseCase {
    constructor(private readonly repository: PostRepository) {}

    async execute(dto: DeletePostCommentDto): Promise<void> {
        if (!dto.postId || !dto.commentId || !dto.driverId) {
            throw new Error("postId, commentId and driverId are required");
        }
        await this.repository.deleteComment(dto.postId, dto.commentId, dto.driverId);
    }
}

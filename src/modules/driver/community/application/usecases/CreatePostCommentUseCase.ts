import { PostCommentView } from "../../domain/types/Post";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { CreatePostCommentDto } from "../dtos/CreatePostCommentDto";

export class CreatePostCommentUseCase {
    constructor(private readonly repository: PostRepository) {}

    async execute(dto: CreatePostCommentDto): Promise<PostCommentView> {
        if (!dto.postId || !dto.driverId || !dto.content?.trim()) {
            throw new Error("postId, driverId and content are required");
        }
        return this.repository.createComment(dto.postId, dto.driverId, dto.content.trim());
    }
}

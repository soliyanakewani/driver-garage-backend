import { PostCommentView } from "../../domain/types/Post";
import { PostRepository } from "../../domain/repositories/PostRepository";
import { ListPostCommentsDto } from "../dtos/ListPostCommentsDto";

export class ListPostCommentsUseCase {
    constructor(private readonly repository: PostRepository) {}

    async execute(dto: ListPostCommentsDto): Promise<PostCommentView[]> {
        if (!dto.postId || !dto.viewerId) {
            throw new Error("postId and viewerId are required");
        }
        return this.repository.listComments(dto.postId, dto.viewerId);
    }
}

import { PostRepository } from "../../domain/repositories/PostRepository";
import { TogglePostLikeDto } from "../dtos/TogglePostLikeDto";

export class TogglePostLikeUseCase {
    constructor(private readonly repository: PostRepository) {}

    async execute(dto: TogglePostLikeDto): Promise<{ liked: boolean; likeCount: number }> {
        if (!dto.postId || !dto.driverId) {
            throw new Error("postId and driverId are required");
        }
        return this.repository.toggleLike(dto.postId, dto.driverId);
    }
}

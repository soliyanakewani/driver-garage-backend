import { PostRepository } from "../../domain/repositories/PostRepository";
import { TogglePostBookmarkDto } from "../dtos/TogglePostBookmarkDto";

export class TogglePostBookmarkUseCase {
    constructor(private readonly repository: PostRepository) {}

    async execute(dto: TogglePostBookmarkDto): Promise<{ bookmarked: boolean }> {
        if (!dto.postId || !dto.driverId) {
            throw new Error("postId and driverId are required");
        }
        return this.repository.toggleBookmark(dto.postId, dto.driverId);
    }
}

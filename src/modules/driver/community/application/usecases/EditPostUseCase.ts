import { PostRepository } from "../../domain/repositories/PostRepository";
import { EditPostDto } from "../dtos/EditPostDto";

function normalizeImageUrls(imageUrl?: string, imageUrls?: string[]): string[] | undefined {
    if (imageUrls !== undefined || imageUrl !== undefined) {
        const fromArray = Array.isArray(imageUrls)
            ? imageUrls.map((u) => String(u).trim()).filter(Boolean)
            : [];
        const legacy = imageUrl?.trim() ? [imageUrl.trim()] : [];
        const merged = [...legacy, ...fromArray];
        return [...new Set(merged)];
    }
    return undefined;
}

export class EditPostUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(dto: EditPostDto): Promise<void> {
        if (!dto.postId || !dto.authorId) throw new Error("postId and authorId are required");
        if (
            dto.title === undefined &&
            dto.content === undefined &&
            dto.imageUrls === undefined
        ) {
            throw new Error("At least one field must be provided");
        }

       /* const imagePayload =
            dto.imageUrl !== undefined || dto.imageUrls !== undefined
                ? normalizeImageUrls(dto.imageUrl, dto.imageUrls)
                : undefined;
                */

        await this.postRepository.updatePost(
            dto.postId,
            dto.title?.trim(),
            dto.content?.trim(),
            dto.authorId,
            undefined,
            dto.imageUrls
          //  imagePayload?.[0],
           // imagePayload
        );
    }
}

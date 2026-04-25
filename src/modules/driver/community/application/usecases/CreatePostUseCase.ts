import { PostRepository } from "../../domain/repositories/PostRepository";
import { CreatePostDto } from "../dtos/CreatePostDto";

function normalizeImageUrls(imageUrl?: string, imageUrls?: string[]): string[] {
    const fromArray = Array.isArray(imageUrls)
        ? imageUrls.map((u) => String(u).trim()).filter(Boolean)
        : [];
    const legacy = imageUrl?.trim() ? [imageUrl.trim()] : [];
    const merged = [...legacy, ...fromArray];
    return [...new Set(merged)];
}

export class CreatePostUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(dto: CreatePostDto): Promise<void> {
        if (!dto.content?.trim() || !dto.authorId) {
            throw new Error("content and authorId are required");
        }

        const imageUrls = normalizeImageUrls(dto.imageUrl, dto.imageUrls);

        await this.postRepository.createPost({
            authorId: dto.authorId,
            title: dto.title?.trim() || undefined,
            content: dto.content.trim(),
            imageUrl: imageUrls[0],
            imageUrls: imageUrls.length ? imageUrls : undefined,
        });
    }
}

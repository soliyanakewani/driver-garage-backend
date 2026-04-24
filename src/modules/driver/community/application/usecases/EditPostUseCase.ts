import { PostRepository } from "../../domain/repositories/PostRepository";
import { EditPostDto } from "../dtos/EditPostDto";

export class EditPostUseCase {
    constructor(private postRepository: PostRepository) {}

<<<<<<< Updated upstream
    async execute(dto: EditPostDto): Promise<any> {

        await this.postRepository.updatePost(
            dto.postId, 
            dto.title, 
            dto.content, 
            dto.authorId
=======
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
>>>>>>> Stashed changes
        );
    }
}
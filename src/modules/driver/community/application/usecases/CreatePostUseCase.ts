import { PostRepository } from "../../domain/repositories/PostRepository";
import { CreatePostDto } from "../dtos/CreatePostDto";

export class CreatePostUseCase {
    constructor(private postRepository: PostRepository) {} 

    async execute(dto: CreatePostDto): Promise<any> {
        if (!dto.title || !dto.content || !dto.authorId) {
            throw new Error("Title, content and authorId are required");
        }
        
        await this.postRepository.createPost(dto);
    }}
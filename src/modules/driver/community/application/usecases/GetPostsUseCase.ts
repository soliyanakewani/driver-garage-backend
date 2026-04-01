import { PostRepository } from "../../domain/repositories/PostRepository";
import { GetPostsDto } from "../dtos/GetPostsDto";

export class GetPostsUseCase {
    constructor(private repo: PostRepository) {}

    async execute(dto: GetPostsDto){
        return await this.repo.findAll(dto.page, dto.limit);
    }
}
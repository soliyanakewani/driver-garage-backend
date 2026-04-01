export interface CreatePostDto {
    title: string;
    content: string;
    imageUrl?: string;
    authorId: string;
}
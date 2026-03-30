export interface PostRepository {
    createPost(post:{
        authorId: string, 
        title: string, 
        content: string, 
        imageUrl?: string
    }): Promise<any>;

    findAll(page: number, limit: number): Promise<any[]>;

   // getPostById(postId: string): Promise<any>;
   // getPostsByAuthor(authorId: string): Promise<any[]>;
    updatePost(
        postId: string, 
        title?: string, 
        content?: string,
        authorId?: string, 
        imageUrl?: string
    ): Promise<any>;

    deletePost(
        postId: string,
        authorId: string
    ): Promise<void>;
}
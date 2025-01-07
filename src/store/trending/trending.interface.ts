import { BSON } from "realm";


export interface TrendingTypeArticle {
    _id:BSON.ObjectId,
    description: string;
    article_id: string;
    title: string;
    content: string;
    url: string;
    urlToImage: string;
    category: string;
    publishedAt: Date;
    updatedAt:Date;
    // status: ArticleStatus;
    isLiked?: boolean;
    
}
import { BSON } from "realm";
import { ArticleStatus } from "./article.enum";

export interface ArticleType {
    _id:BSON.ObjectId,
    description: string;
    article_id: string;
    title: string;
    content: string;
    url: string;
    urlToImage: string;
    category: string;
    publishedAt: Date;
    status: ArticleStatus;
    isLiked?: boolean;
}
import { Realm, RealmProvider, useRealm, useQuery } from '@realm/react'
import { ArticleStatus } from './article.enum';

class Article extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    description!: string;
    article_id!: string;
    title!: string;
    content!: string;
    url!: string;
    urlToImage!: string;
    category!: string;
    publishedAt!:Date;
    status!: ArticleStatus;
    isLiked!:boolean;

    static schema: Realm.ObjectSchema = {
        name: 'Article',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',  
            article_id: { type: 'string', },
            title: { type: 'string', },
            description: { type: 'string', },
            url: { type: 'string', },
            urlToImage: { type: 'string', },
            publishedAt: { type: 'date', },
            content: { type: 'string', },
            category: { type: 'string', },
            status: { type: 'string', },
            isActive: { type: 'bool', default: false },
            isPublished: { type: 'string', optional:true },
            isLiked:{type:'bool', default:false},
        },
    };
}

export default Article;
import Realm from 'realm';
import Article from './article.schema';
import { realmConfig } from '..';
import { infoLog } from '../../utils/debug';
import { ArticleType } from './article.interface';

let realm: Realm = new Realm({ schema: realmConfig });

export const initializeRealm = () => {
    if (!realm) {
        realm = new Realm({ schema: realmConfig });
    }
};


export const saveSingleArticle = (newArticle: ArticleType) => {
    try {
        realm && realm.write(() => {
            const data = realm.create(
                Article.schema.name,
                { ...newArticle, _id: new Realm.BSON.ObjectId(newArticle._id) },
                Realm.UpdateMode.Modified
            );
        })
    } catch (error) {
        throw (error);
    }
}

export const saveManyArticles = (newArticles: Array<ArticleType>) => {
    try {
        initializeRealm()
        newArticles.forEach((item) => { saveSingleArticle(item) })
    } catch (error) {
        throw (error);
    }
}

export const deleteArticles = () => {
    realm.write(()=>{
        const articles = realm.objects(Article.schema.name);
        console.log(articles, 'art..')
        if (articles.length > 0) {
            realm.delete(articles)
        }
    })
}


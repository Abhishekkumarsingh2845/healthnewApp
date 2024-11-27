import Realm, { BSON } from 'realm';
import Article from './article.schema';
import { realmConfig } from '..';
import { infoLog } from '../../utils/debug';
import { ArticleType } from './article.interface';
import Favorite from '../favorite/favorite.schema';

let realm: Realm;
export const initializeRealm = () => {
    if (!realm) {
        realm = new Realm({ schema: realmConfig });
    }
};


export const saveSingleArticle = (newArticle: ArticleType) => {
    try {
        realm && realm.write(() => {
            const articleId = new BSON.ObjectId(newArticle._id);
            let data = {
                ...newArticle,
                _id: articleId,
            }
            const fav = realm.objects(Favorite.schema.name).filtered(`articleId == $0`, articleId);
            if (fav.length > 0) {
                data['isLiked'] = true
            } else {
                data['isLiked'] = false
            }
            realm.create(
                Article.schema.name,
                data,
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
    realm && realm.write(() => {
        const articles = realm.objects(Article.schema.name);
        console.log(articles, 'art..')
        if (articles.length > 0) {
            realm.delete(articles)
        }
    })
}


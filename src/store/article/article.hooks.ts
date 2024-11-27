import { useCallback, useEffect, useMemo, useState } from 'react';
import Article from './article.schema';
import { useQuery, useRealm } from '@realm/react';
import { BSON } from 'realm';
import { ArticleType } from './article.interface';
import Favorite from '../favorite/favorite.schema';


export const useGetArticles = () => {
    const articles = useQuery(Article).sorted('publishedAt', true,);
    console.log("RUN GET>>>")
    return articles;
};
export const useGetFavArticles = () => {
    const articles = useQuery(Article).filtered(`isLiked==true`).sorted('publishedAt', true,);
    console.log("RUN GET>>>")
    return articles;
};
export const useGetArticlesById = (id: BSON.ObjectId) => {
    console.log(id, "ID>>>")
    const articles = useQuery(Article).filtered(`_id == $0`,id);
    return articles[0];
};
export const useToggleLikeArticle = () => {
    const realm = useRealm()
    const toggleLike = useCallback((id: BSON.ObjectId) => {
        console.log("Called...");
        const article = realm.objectForPrimaryKey(Article.schema.name, id) as ArticleType;
        realm.write(() => {
            article.isLiked = !article.isLiked ?? false
            const fav = realm.objects(Favorite.schema.name).filtered(`articleId == $0`,article._id);
            if(fav.length>0){
                console.log('Delete')
                realm.delete(fav);
            }
            if(article.isLiked){
                console.log('ADD')
                realm.create(Favorite.schema.name,{_id:new BSON.ObjectId(), articleId:article._id})
            }
        })
    }, [realm])
    return { toggleLike };
};



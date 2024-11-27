import { useCallback, useEffect, useMemo, useState } from 'react';
import Article from './article.schema';
import { useQuery, useRealm } from '@realm/react';
import { BSON } from 'realm';
import { ArticleType } from './article.interface';


export const useGetArticles = () => {
    const articles = useQuery(Article).sorted('publishedAt', true,);
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
        const data = realm.objectForPrimaryKey(Article.schema.name, id) as ArticleType;
        realm.write(() => {
            data.isLiked = !data.isLiked ?? false
        })
    }, [realm])
    return { toggleLike };
};



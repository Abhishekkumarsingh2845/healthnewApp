import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {useCallback} from 'react';
import TrendingArticle from './trending.schema';
import Favorite from './../favorite/favorite.schema';

export const useToggleTrendingLike = () => {
  const realm = useRealm();

  const toggleLike = useCallback(
    (id: BSON.ObjectId) => {
      console.log('Called...', id);
      const article = realm.objectForPrimaryKey(
        TrendingArticle.schema.name,
        id,
      ) as any;

      console.log('Called...');
      console.log(article, 'art..');

      realm.write(() => {
        article.isLiked = !(article?.isLiked ?? false);
        console.log(article.isLiked, 'LIKED...');
        const fav = realm
          .objects(Favorite.schema.name)
          .filtered(`articleId == $0`, article._id);

        if (fav.length > 0) {
          console.log('Delete trending progress');
          realm.delete(fav);
          const fa = realm.objects(Favorite.schema.name);
          console.log('deleting terding articles completed', fa.toJSON());
        }

        if (article.isLiked) {
          console.log('ADD trending progress');
          realm.create(Favorite.schema.name, {
            _id: new BSON.ObjectId(),
            articleId: article._id,
          });
          const favEntries = realm.objects(Favorite.schema.name);
          console.log('adding terding articles', favEntries.toJSON());
        }
      });
    },
    [realm],
  );

  return {toggleLike};
};


export const usetrendingFavArticles = () => {

  // console.log("ccccc->>",ll);

  const articles = useQuery(TrendingArticle)
    .filtered(`isLiked==true`)
    .sorted('publishedAt', true);

  return articles;
 
};




export const useDeleteTrendingArticles = () => {
  const realm = useRealm();

  const deleteTrendingArticles = useCallback(() => {
    realm.write(() => {
      const trendingArticles = realm.objects(TrendingArticle.schema.name);
      console.log('Deleting all trending articles:', trendingArticles.toJSON());

      if (trendingArticles.length > 0) {
        realm.delete(trendingArticles); // Deletes all trending articles
      }
    });
  }, [realm]);

  return {deleteTrendingArticles};
};

import {useRealm} from '@realm/react';
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
      console.log(article, 'art..')
      realm.write(() => {
        article.isLiked = !(article?.isLiked ?? false);
        console.log(article.isLiked, "LIKED...")
        const fav = realm
          .objects(Favorite.schema.name)
          .filtered(`articleId == $0`, article._id);
        if (fav.length > 0) {
          console.log('Delete');
          realm.delete(fav);
        }
        if (article.isLiked) {
          console.log('ADD');
          realm.create(Favorite.schema.name, {
            _id: new BSON.ObjectId(),
            articleId: article._id,
          });
        }
      });
    },
    [realm],
  );

  return {toggleLike};
};

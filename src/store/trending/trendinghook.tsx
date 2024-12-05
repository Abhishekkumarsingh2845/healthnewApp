import { useCallback } from 'react';
import { Realm, useQuery } from '@realm/react';
import TrendingArticle from './trending.schema';
import Favorite from './../favorite/favorite.schema';

export const useToggleTrendingLike = (realm: Realm) => {
    const toggleTrendingLike = useCallback(
      (id: Realm.BSON.ObjectId | string) => {
        console.log('Toggle Trending Like Called...');
  
        // Ensure id is of type ObjectId
        const objectId =
          typeof id === 'string' ? new Realm.BSON.ObjectId(id) : id;
  
        // Fetch the TrendingArticle object by its ID
        const trendingArticle = realm.objectForPrimaryKey(
          TrendingArticle.schema.name,
          objectId
        );
  
        if (!trendingArticle) {
          console.error('Trending Article not found!');
          return;
        }
  
        // Begin a write transaction
        realm.write(() => {
          // Toggle the isLiked property
          trendingArticle.isLiked = !(trendingArticle?.isLiked ?? false);
  
          // Check if the article is already in the Favorite schema
          const fav = realm
            .objects(Favorite.schema.name)
            .filtered('articleId == $0', trendingArticle._id);
  
          if (fav.length > 0) {
            // If it exists, delete it (remove from favorites)
            console.log('Removing from Favorites...');
            realm.delete(fav);
          }
  
          if (trendingArticle.isLiked) {
            // If isLiked is true, add it to the Favorite schema
            console.log('Adding to Favorites...');
            realm.create(Favorite.schema.name, {
              _id: new Realm.BSON.ObjectId(), // Generate a new unique ObjectId
              articleId: trendingArticle._id, // Reference the trending article's ObjectId
            });
          }
        });
      },
      [realm]
    );
  
    return toggleTrendingLike;
  };



export const useGetFavTrendingArticles = () => {
    const trendingArticles = useQuery(TrendingArticle)
      .filtered(`isLiked == true`)
      .sorted('publishedAt', true);
  
    return trendingArticles;
  };
  
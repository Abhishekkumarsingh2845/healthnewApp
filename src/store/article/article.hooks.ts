import {useCallback, useEffect, useMemo, useState} from 'react';
import Article from './article.schema';
import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {ArticleType} from './article.interface';
import Favorite from '../favorite/favorite.schema';
import TrendingArticle from '../trending/trending.schema';

export const useGetArticles = () => {
  const articles = useQuery(Article).sorted('updatedAt', true);
  console.log('RUN GET>>>');
  return articles;
};
export const useGetFavArticles = () => {
  const ll = useQuery(Article);
  // console.log('ccccc->>', ll);

  const articles = useQuery(Article)
    .filtered(`isLiked==true`)
    .sorted('updatedAt', true);

  return articles;
};
export const useGetArticlesById = (id: BSON.ObjectId) => {
  console.log(id, 'ID>>>');
  const articles = useQuery(Article).filtered(`_id == $0`, id);
  return articles[0];
};

export const useToggleLikeArticle = () => {
  const realm = useRealm();
  const toggleLike = useCallback(
    (id: BSON.ObjectId) => {
      console.log('Called...', id);
      const article = realm.objectForPrimaryKey(
        Article.schema.name,
        id,
      ) as ArticleType;
      // const treadingArticle = realm.objectForPrimaryKey(
      //   TrendingArticle.schema.name,
      //   id,
      // ) as ArticleType;
      console.log('Called...');

      realm.write(() => {
        article.isLiked = !(article?.isLiked ?? false);
        // treadingArticle.isLiked = !(treadingArticle?.isLiked ?? false);
        const fav = realm
          .objects(Favorite.schema.name)
          .filtered(`articleId == $0`, article._id);
        if (fav.length > 0) {
          console.log('Delete');
          realm.delete(fav);
          const favE = realm.objects(Favorite.schema.name);
          console.log('Delete latest data', favE.toJSON());
        }
        if (
          article.isLiked

          // &&

          // treadingArticle.isLiked
        ) {
          console.log('Add');
          realm.create(Favorite.schema.name, {
            _id: new BSON.ObjectId(),
            articleId: article._id,
          });
          const favEnt = realm.objects(Favorite.schema.name);
          console.log(
            'Adding latest data->>>>>>>>>>>>>>>>>>>',
            favEnt.toJSON(),
          );
        }
      });
    },
    [realm],
  );

  // const saveSingleArticle = (newArticle: ArticleType) => {
  //   try {
  //     realm &&
  //       realm.write(() => {
  //         const articleId = new BSON.ObjectId(newArticle._id);
  //         let data = {
  //           ...newArticle,
  //           _id: articleId,
  //         };
  //         const fav = realm
  //           .objects(Favorite.schema.name)
  //           .filtered(`articleId == $0`, articleId);
  //         if (fav.length > 0) {
  //           data['isLiked'] = true;
  //         } else {
  //           data['isLiked'] = false;
  //         }
  //         realm.create(Article.schema.name, data, Realm.UpdateMode.Modified);
  //       });
  //   } catch (error) {
  //     console.log('error in latest articles', error);
  //     throw error;
  //   }
  // };
  const saveSingleArticle = (newArticle: ArticleType) => {
    try {
      realm &&
        realm.write(() => {
          const articleId = new BSON.ObjectId(newArticle._id);
          let data = {
            ...newArticle,
            _id: articleId,
            category: newArticle.category || 'defaultCategory',  // Set default if missing
          };
  
          // Check if 'category' is still missing, handle accordingly
          if (!data.category) {
            console.log('Warning: Missing category for article', newArticle);
          }
  
          const fav = realm
            .objects(Favorite.schema.name)
            .filtered(`articleId == $0`, articleId);
          if (fav.length > 0) {
            data['isLiked'] = true;
          } else {
            data['isLiked'] = false;
          }
  
          realm.create(Article.schema.name, data, Realm.UpdateMode.Modified);
        });
    } catch (error) {
      console.log('error in latest articles', error);
      throw error;
    }
  };
  
  const saveManyArticles = useCallback(
    (newArticles: Array<ArticleType>) => {
      try {
        newArticles.forEach(item => {
          saveSingleArticle(item);
        });
      } catch (error) {
        console.log('error in latest articles', error);

        throw error;
      }
    },
    [realm],
  );

  const deleteArticles = useCallback(() => {
    realm &&
      realm.write(() => {
        const articles = realm.objects(Article.schema.name);
        // console.log(articles, 'art..')
        if (articles.length > 0) {
          realm.delete(articles);
        }
      });
  }, [realm]);

  return {toggleLike, saveSingleArticle, deleteArticles, saveManyArticles};
};

//   const treading:Array<any> = useQuery(TrendingArticle)
//   .filtered(`isLiked==true`)
//   .sorted('publishedAt', true) as any ;
// // console.log("RUN GET>>>")
// .concat(treading);

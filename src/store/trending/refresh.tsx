// import {useCallback, useState} from 'react';
// import {fetchLatestArticles} from '../../store/article/article.network';
// import axios from 'axios';
// import {useRealm} from '@realm/react';
// import TrendingArticle from '../../store/trending/trending.schema';
// import {BSON} from 'realm';
// import Favorite from '../../store/favorite/favorite.schema';
// import {useToggleLikeArticle} from '../../store/article/article.hooks';
// import {ArticleType} from '../article/article.interface'; // Import your ArticleType if you have one

// interface TrendingArticleFromServer {
//   _id: string;
//   category?: string;
//   // ... other properties of a trending article from the server
// }

// export const useRefreshData = () => {
//   const [isFetching, setFetching] = useState(false);



//   const realm = useRealm();
//   const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

//   const fetchTrendingArticles = useCallback(async () => {
//     try {
//       const response = await axios.get<{
//         status: boolean;
//         data: TrendingArticleFromServer[];
//       }>('http://15.206.16.230:4000/api/v1/android/trendingarticle');

//       if (response.data.status && response.data.data.length > 0) {
//         const fetchedArticleIds = response.data.data.map(
//           article => article._id,
//         );

//         realm.write(() => {
//           response.data.data.forEach(article => {
//             const articleId = new BSON.ObjectId(article._id);
//             const data: {
//               _id: BSON.ObjectId;
//               category: string;
//               isLiked: boolean;
//             } = {
//               ...article,
//               _id: articleId,
//               category: article.category || 'defaultCategory',
//               isLiked: false, // default value, will be updated below
//             };

//             const fav = realm
//               .objects(Favorite.schema.name)
//               .filtered(`articleId == $0`, articleId);
//             data['isLiked'] = fav.length > 0;

//             realm.create(
//               TrendingArticle.schema.name,
//               data,
//               Realm.UpdateMode.Modified,
//             );
//           });

//           const currentArticles = realm.objects(TrendingArticle.schema.name);
//           currentArticles.forEach((currentArticle: any) => {
//             if (
//               !fetchedArticleIds.includes(
//                 (currentArticle._id as BSON.ObjectId).toString(),
//               )
//             ) {
//               realm.delete(currentArticle);
//             }
//           });
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching trending articles:', error);
//     }
//   }, [realm]);

//   const getLatestArticle = useCallback(
//     async (page: number) => {
//       const res = await fetchLatestArticles({page, search: '', limit: 10});
//       if (page === 1) {
//         deleteArticles();
//       }
//       if (res.status && res?.response?.articles) {
//         saveManyArticles(res?.response?.articles as ArticleType[]); // Type assertion if needed
//       }
//     },
//     [deleteArticles, saveManyArticles],
//   );

//   const init = useCallback(async () => {
//     await getLatestArticle(1);
//     await fetchTrendingArticles();
//   }, [getLatestArticle, fetchTrendingArticles]);

//   return {init};
// };
import {useCallback, useState} from 'react';
import {fetchLatestArticles} from '../../store/article/article.network';
import axios from 'axios';
import {useRealm} from '@realm/react';
import TrendingArticle from '../../store/trending/trending.schema';
import {BSON} from 'realm';
import Favorite from '../../store/favorite/favorite.schema';
import {useToggleLikeArticle} from '../../store/article/article.hooks';
import {ArticleType} from '../article/article.interface'; // Import your ArticleType if you have one

interface TrendingArticleFromServer {
  _id: string;
  category?: string;
  // ... other properties of a trending article from the server
}

export const useRefreshData = () => {
  const [isFetching, setIsFetching] = useState(false); // State to track loading status
  const realm = useRealm();
  const {deleteArticles, saveManyArticles} = useToggleLikeArticle();

  const fetchTrendingArticles = useCallback(async () => {
    try {
      const response = await axios.get<{
        status: boolean;
        data: TrendingArticleFromServer[];
      }>('http://15.206.16.230:4000/api/v1/android/trendingarticle');

      if (response.data.status && response.data.data.length > 0) {
        const fetchedArticleIds = response.data.data.map(
          article => article._id,
        );

        realm.write(() => {
          response.data.data.forEach(article => {
            const articleId = new BSON.ObjectId(article._id);
            const data: {
              _id: BSON.ObjectId;
              category: string;
              isLiked: boolean;
            } = {
              ...article,
              _id: articleId,
              category: article.category || 'defaultCategory',
              isLiked: false, // default value, will be updated below
            };

            const fav = realm
              .objects(Favorite.schema.name)
              .filtered(`articleId == $0`, articleId);
            data['isLiked'] = fav.length > 0;

            realm.create(
              TrendingArticle.schema.name,
              data,
              Realm.UpdateMode.Modified,
            );
          });

          const currentArticles = realm.objects(TrendingArticle.schema.name);
          currentArticles.forEach((currentArticle: any) => {
            if (
              !fetchedArticleIds.includes(
                (currentArticle._id as BSON.ObjectId).toString(),
              )
            ) {
              realm.delete(currentArticle);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
    } finally {
    }
  }, [realm]);

  const getLatestArticle = useCallback(
    async (page: number) => {
      try {
        const res = await fetchLatestArticles({page, search: '', limit: 10});
        if (page === 1) {
          deleteArticles();
        }
        if (res.status && res?.response?.articles) {
          saveManyArticles(res?.response?.articles as ArticleType[]); // Type assertion if needed
        }
      } catch (error) {
        console.error('Error fetching latest articles:', error);
      } finally {
      }
    },
    [deleteArticles, saveManyArticles],
  );

  const init = useCallback(async () => {
    setIsFetching(true); // Start loading
    try {
      await getLatestArticle(1);
      await fetchTrendingArticles();
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      setIsFetching(false); // Stop loading
    }
  }, [getLatestArticle, fetchTrendingArticles]);

  return {init, isFetching}; // Return isFetching state
};
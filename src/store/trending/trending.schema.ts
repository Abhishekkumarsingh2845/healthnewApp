// import { Realm } from '@realm/react';

// class TrendingArticle extends Realm.Object {
//   _id!: string;
//   title!: string;

//   static schema = {
//     name: 'TrendingArticle',
//     primaryKey: '_id',
//     properties: {
//       _id: 'string',
//       title: 'string',
//     },
//   };
// }

// export default TrendingArticle;

// trending.schema.ts]

import Realm from 'realm';

class TrendingArticle extends Realm.Object {
  _id!: string;
  article_id!: string;
  title!: string;
  description!: string;
  url!: string;
  urlToImage!: string;
  publishedAt?: string;
  content!: string;
  category!: string;
  status!: string;
  isActive!: boolean;
  isTrending!: boolean;
  

  static schema = {
    name: 'TrendingArticle',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      article_id: 'string',
      title: 'string',
      description: 'string',

      urlToImage: 'string',

      category: 'string',
     
    },
  };
}

export default TrendingArticle;

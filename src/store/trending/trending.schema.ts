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
  _id!: Realm.BSON.ObjectId;;
  article_id!: string;
  title!: string;
  description!: string;
  url!: string;
  urlToImage!: string;
  updatedAt!: Date;
  publishedAt?: string;
  content!: string;
  category!: string;
  status!: string;
  isActive!: boolean;
  isTrending!: boolean;
  isLiked!: boolean;
  

  static schema = {
    name: 'TrendingArticle',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      article_id: 'string',
      title: 'string',
      description: 'string',
      publishedAt: 'string?',
      urlToImage: 'string',
      isTrending: 'bool',
      category: 'string',
      updatedAt: 'date',
      isLiked: {type: 'bool', default: false},
     
    },
  };
}

export default TrendingArticle;

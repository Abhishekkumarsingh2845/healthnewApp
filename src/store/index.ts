import { AnyRealmObject, ObjectSchema, RealmObjectConstructor, schemaVersion } from "realm";
import { createRealmContext } from "@realm/react";
import Article from "./article/article.schema";
import Favorite from "./favorite/favorite.schema";
import Category from "./category/category.schema";
import TrendingArticle from "./trending/trending.schema";
export const realmConfig: (RealmObjectConstructor<AnyRealmObject> | ObjectSchema)[] = [Article, Favorite, Category,TrendingArticle]
const config = {
   schema: [Favorite.schema,Article.schema, Category.schema,TrendingArticle.schema],
   deleteRealmIfMigrationNeeded: true,
   
};

export default createRealmContext(config);
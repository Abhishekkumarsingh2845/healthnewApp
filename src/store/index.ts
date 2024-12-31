import { AnyRealmObject, ObjectSchema, RealmObjectConstructor, schemaVersion } from "realm";
import { createRealmContext } from "@realm/react";
import Article from "./article/article.schema";
import Favorite from "./favorite/favorite.schema";
import Category from "./category/category.schema";
import TrendingArticle from "./trending/trending.schema";
import FilterCategory from "./filtercategory/filtercatergory.schema";
import Datesch from "./trending/datee/date.schema";
export const realmConfig: (RealmObjectConstructor<AnyRealmObject> | ObjectSchema)[] = [Article, Favorite, Category, FilterCategory,Datesch, TrendingArticle]
const config = {
   schema: [Favorite.schema,Article.schema, Category.schema,TrendingArticle.schema,FilterCategory.schema,Datesch.schema],
   deleteRealmIfMigrationNeeded: true,
   
};

export default createRealmContext(config);
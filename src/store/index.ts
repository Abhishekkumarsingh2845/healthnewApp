import { AnyRealmObject, ObjectSchema, RealmObjectConstructor } from "realm";
import { createRealmContext } from "@realm/react";
import Article from "./article/article.schema";
import Favorite from "./favorite/favorite.schema";
import Category from "./category/category.schema";
export const realmConfig: (RealmObjectConstructor<AnyRealmObject> | ObjectSchema)[] = [Article, Favorite, Category]
const config = {
   schema: [Favorite.schema,Article.schema, Category.schema],
   
};

export default createRealmContext(config);
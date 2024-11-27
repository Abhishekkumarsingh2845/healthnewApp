import { AnyRealmObject, ObjectSchema, RealmObjectConstructor } from "realm";
import { createRealmContext } from "@realm/react";
import Article from "./article/article.schema";
import Favorite from "./favorite/favorite.schema";
export const realmConfig: (RealmObjectConstructor<AnyRealmObject> | ObjectSchema)[] = [Article, Favorite]
const config = {
   schema: [Favorite.schema,Article.schema,],
   
};

export default createRealmContext(config);
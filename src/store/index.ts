import { AnyRealmObject, ObjectSchema, RealmObjectConstructor } from "realm";
import { createRealmContext } from "@realm/react";
import Article from "./article/article.schema";
export const realmConfig: (RealmObjectConstructor<AnyRealmObject> | ObjectSchema)[] = [Article]
const config = {
   schema: [Article.schema],
};

export default createRealmContext(config);
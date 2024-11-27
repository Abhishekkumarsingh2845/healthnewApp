import { Realm, RealmProvider, useRealm, useQuery } from '@realm/react'

class Favorite extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    articleId!:Realm.BSON.ObjectId;
    static schema: Realm.ObjectSchema = {
        name: 'Favorite',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',  
            articleId: {type:'objectId'}
        },
    };
}

export default Favorite;
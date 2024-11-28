import { Realm, RealmProvider, useRealm, useQuery } from '@realm/react'

class Category extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    catName!:String;
    image!:String;
    createdAt!:Date;
    updatedAt!:Date;
    static schema: Realm.ObjectSchema = {
        name: 'Category',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',  
            catName: {type:'string'},
            createdAt:{type:'date'},
            image:{type:'string', optional:true},
            updatedAt:{type:'date'},

        },
    };
}

export default Category;
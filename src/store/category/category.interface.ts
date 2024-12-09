import { BSON } from "realm";

export interface CategoryType {
    _id?: BSON.ObjectId,
    catName:String,
    catImageblack?:String,
    image?:String,
    createdAt:Date,
    updatedAt:Date
}
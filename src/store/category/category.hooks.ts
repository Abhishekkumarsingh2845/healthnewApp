import { useQuery, useRealm } from "@realm/react";
import { useCallback, useMemo } from "react";
import { BSON } from "realm";
import { fetchCategories } from "./category.network";
import Category from "./category.schema";
import { CategoryType } from "./category.interface";
import { showToastMessage } from "../../utils/toast";

export const useCategory = () => {
    const realm = useRealm()
    const data = useQuery(Category.schema.name)
    const categories:Array<CategoryType> = data as unknown as  Array<CategoryType>;
    const getCatories = useCallback(async () => {
        const res = await fetchCategories();
        if (res.status) {
            deleteCategories();
            const currentDate = new Date()
            addCategory({
                catName: "All",
                createdAt: currentDate,
                updatedAt: currentDate
            })
            if (res.response.length > 0) {

                const list: Array<CategoryType> = res.response;
                list.forEach((item, index) => {
                    addCategory(item);
                })
            }
        }else{
            showToastMessage(res.message, 'error');
        }
    }, [])

    const addCategory = useCallback((newCategory: CategoryType) => {
        realm.write(() => {
            const id = new BSON.ObjectId(newCategory._id);
            let data = {
                ...newCategory,
                _id: id,
            }
            const result =  realm.create(Category.schema.name, data)
            // console.log(result, 'result');

        })
    }, [])

    const deleteCategories = useCallback(() => {
        realm.write(() => {
            const categories = realm.objects(Category.schema.name);
            if (categories.length > 0) {
                realm.delete(categories)
            }
        })
    }, [])

    

    return { getCatories, addCategory, deleteCategories, categories };
};
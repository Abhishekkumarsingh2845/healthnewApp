import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ReactNode, memo, useMemo, useState } from "react";
import { moderateScale } from "react-native-size-matters";
import { FontStyle } from "../../config/style.config";
import { Colors } from "../../config/colors.config";
import { Fonts } from "../../config/font.config";
import { Icons, Images } from "../../generated/image.assets";
import { useCategory } from "../../store/category/category.hooks";
import { CategoryType } from "../../store/category/category.interface";
// const CategoriesOptions: Array<CategoryPropType> = [
//     {
//         name: 'All',
//         value: 'all',
//         inActiveIcColor: '#7A7F8B',
//     },
//     {
//         name: 'Nutrition',
//         value: 'Nutrition',
//         inActiveIcColor: '#7A7F8B',
//         icon: Icons.ic_nutrition
//     },
//     {
//         name: 'Fitness',
//         value: 'Fitness',
//         inActiveIcColor: '#FF426F',
//         icon: Icons.ic_fitness
//     },
//     {
//         name: 'Mental Health',
//         value: 'Mental Health',
//         inActiveIcColor: '#5ACF57',
//         icon: Icons.ic_mental_health
//     },

// ];
const Categories = () => {
    const {categories} = useCategory();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <View style={style.container}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                        categories.map((item, index) => {
                            // console.log('render');
                            const isActive = (activeIndex == index) ? true : false;
                            return (
                                <Pressable key={index} onPress={() => { setActiveIndex(index) }}>
                                    <MemomizedCategories inActiveIcColor={""}  {...item} isActive={isActive} />
                                </Pressable>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </>
    )
}

interface CategoryPropType extends CategoryType {

    isActive?: boolean,
    inActiveIcColor: string,
    // value: string,
    // icon?: ImageSourcePropType
}
const Category = (props: CategoryPropType) => {
    // const Icon = props.icon;
    const name = useMemo(()=>{
        return props.catName.replace('-',' ')
    },[props.catName])
    return (
        <View style={[style.catgoryContainer, { backgroundColor: (props.isActive) ? Colors.primary : Colors.white,borderColor:(props.isActive)?Colors.primary:Colors.black }]}>
            {/* {
                props.icon &&
                <Image source={props.icon} style={{ width: moderateScale(16), height: moderateScale(16) }} tintColor={props.isActive ? Colors.white : Colors.primary} resizeMode={'contain'} />
            } */}
            {/* <Icon width={moderateScale(16)} height={moderateScale(16)} color={(props.isActive)?Colors.white:props.inActiveIcColor}  /> */}
            <Text style={[(props.isActive) ? style.activeTitle : style.inactiveTtitle,]} >{name}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        marginTop: moderateScale(20),
        marginBottom: moderateScale(10),

        // marginVertical: moderateScale()
    },
    catgoryContainer: {
        marginHorizontal: moderateScale(2),
        paddingHorizontal: moderateScale(14),
        backgroundColor: '#F2F4F7',
        borderRadius: moderateScale(20),
        flexDirection: 'row',
        gap: moderateScale(3),
        marginRight: moderateScale(8),
        paddingVertical: moderateScale(8),
        borderWidth:1,
    },
    activeTitle: {
        fontFamily: Fonts.semibold,
        fontSize: moderateScale(14),
        color: Colors.white
    },
    inactiveTtitle: {
        fontFamily: Fonts.regular,
        color: Colors.black,
        fontSize: moderateScale(14)
    }

})
const MemomizedCategories = Category;
export default memo(Categories);



// import {
//   Image,
//   ImageSourcePropType,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import {ReactNode, memo, useMemo, useState} from 'react';
// import {moderateScale} from 'react-native-size-matters';
// import {FontStyle} from '../../config/style.config';
// import {Colors} from '../../config/colors.config';
// import {Fonts} from '../../config/font.config';
// import {Icons, Images} from '../../generated/image.assets';
// import {useCategory} from '../../store/category/category.hooks';
// import {CategoryType} from '../../store/category/category.interface';

// const Categories = () => {
//   const {categories} = useCategory();
//   const [activeIndex, setActiveIndex] = useState(0);

//   return (
//     <>
//       <View style={style.container}>
//         <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
//           {categories.map((item, index) => {
//             // console.log('render');
//             const isActive = activeIndex == index ? true : false;
//             return (
//               <Pressable
//                 key={index}
//                 onPress={() => {
//                   setActiveIndex(index);
//                   console.log(`Selected Category: ${item.catName}`);
//                 }}>
//                 <MemomizedCategories
//                   inActiveIcColor={''}
//                   {...item}
//                   isActive={isActive}
//                 />
//               </Pressable>
//             );
//           })}
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// interface CategoryPropType extends CategoryType {
//   isActive?: boolean;
//   inActiveIcColor: string;
//   // value: string,
//   // icon?: ImageSourcePropType
// }
// const Category = (props: CategoryPropType) => {
//   // const Icon = props.icon;
//   const name = useMemo(() => {
//     return props.catName.replace('-', ' ');
//   }, [props.catName]);
//   const img = useMemo(() => {
//     return props.catImageblack;
//   }, [props.catImageblack]);
//   const isAll = props.catName === 'All';
//   return (
//     <View
//       style={[
//         style.catgoryContainer,
//         {
//           backgroundColor: props.isActive ? Colors.primary : Colors.white,
//           borderColor: props.isActive ? Colors.primary : Colors.black,
//           alignItems: 'center',
//         },
//       ]}>
//       {!isAll && (
//         <Image
//           source={typeof img === 'string' ? {uri: img} : img} // If catImage is a URL (string), use { uri: img }, otherwise use the asset directly
//           style={{
//             width: 25,
//             height: 25,
//             resizeMode: 'contain',
//             // backgroundColor: 'red',
//           }} // You may need to adjust the size of the image
//         />
//       )}
//       <Text style={[props.isActive ? style.activeTitle : style.inactiveTtitle]}>
//         {name}
//       </Text>
//     </View>
//   );
// };

// const style = StyleSheet.create({
//   container: {
//     marginTop: moderateScale(20),
//     marginBottom: moderateScale(10),

//     // marginVertical: moderateScale()
//   },
//   catgoryContainer: {
//     marginHorizontal: moderateScale(2),
//     paddingHorizontal: moderateScale(14),
//     backgroundColor: '#F2F4F7',
//     borderRadius: moderateScale(20),
//     flexDirection: 'row',
//     gap: moderateScale(3),
//     marginRight: moderateScale(8),
//     paddingVertical: moderateScale(8),
//     borderWidth: 1,
//   },
//   activeTitle: {
//     fontFamily: Fonts.semibold,
//     fontSize: moderateScale(14),
//     color: Colors.white,
//   },
//   inactiveTtitle: {
//     fontFamily: Fonts.regular,
//     color: Colors.black,
//     fontSize: moderateScale(14),
//   },
// });
// const MemomizedCategories = Category;
// export default memo(Categories);





import React, {useState, useMemo, memo} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {FontStyle} from '../../config/style.config';
import {Colors} from '../../config/colors.config';
import {Fonts} from '../../config/font.config';
import {useCategory} from '../../store/category/category.hooks';
import { SvgUri } from 'react-native-svg';

const Categories = ({onCategoryChange}: {onCategoryChange: (category: string) => void}) => {
  const {categories} = useCategory();
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <View style={style.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {categories.map((item, index) => {
          const isActive = activeCategory === item.catName;

          return (
            <Pressable
              key={index}
              onPress={() => {
                setActiveCategory(item.catName);
                onCategoryChange(item.catName); // Notify parent about category change
              }}>
              <MemomizedCategories
                inActiveIcColor=""
                {...item}
                isActive={isActive}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

interface CategoryPropType {
  isActive?: boolean;
  inActiveIcColor: string;
  catName: string;
  catImageblack: string | ImageSourcePropType;
}

const Category = (props: CategoryPropType) => {
  const name = useMemo(() => props.catName.replace('-', ' '), [props.catName]);
  const img = useMemo(() => props.catImageblack, [props.catImageblack]);
  const isAll = props.catName === 'All';
  return (
    <View
      style={[
        style.catgoryContainer,
        {
          backgroundColor: props.isActive ? Colors.primary : Colors.white,
          borderColor: props.isActive ? Colors.primary : Colors.black,
          alignItems:"center",
          paddingHorizontal: isAll ? moderateScale(20) : moderateScale(14),
          paddingVertical: isAll ? moderateScale(10) : moderateScale(8),
        },
      ]}>
      {!isAll && (
        <View style ={{height : 25, width: 25}}>
          <SvgUri
          uri={img}  
          onError={() => console.log('error svg')}
          width="100%" 
          height="100%" />
        </View>
      )}
      <Text style={props.isActive ? style.activeTitle : style.inactiveTtitle}>
        {name}
      </Text>
    </View>
  );
};

const MemomizedCategories = memo(Category);

const style = StyleSheet.create({
  container: {
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10),
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
    borderWidth: 1,
  },
  activeTitle: {
    fontFamily: Fonts.semibold,
    fontSize: moderateScale(14),
    color: Colors.white,
  },
  inactiveTtitle: {
    fontFamily: Fonts.regular,
    color: Colors.black,
    fontSize: moderateScale(14),
  },
});

export default memo(Categories);






















// import React, {memo, useEffect, useState} from 'react';
// import {
//   Image,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import {moderateScale} from 'react-native-size-matters';
// import {FontStyle} from '../../config/style.config';
// import {Colors} from '../../config/colors.config';
// import {Fonts} from '../../config/font.config';
// import {useCategory} from '../../store/category/category.hooks';
// import {CategoryType} from '../../store/category/category.interface';

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     // Fetch categories from the API
//     fetch('http://15.206.16.230:4000/api/v1/android/getlist')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status) {
//           setCategories(data.data); // Set the categories from the API response
//         }
//       })
//       .catch((error) => console.error('Error fetching categories:', error));
//   }, []);

//   return (
//     <View style={style.container}>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {categories.map((item, index) => {
//           const isActive = activeIndex === index;
//           return (
//             <Pressable key={index} onPress={() => setActiveIndex(index)}>
//               <MemomizedCategories
//                 {...item}
//                 isActive={isActive}
//                 inActiveIcColor=""
//               />
//             </Pressable>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// };

// interface CategoryPropType extends CategoryType {
//   isActive?: boolean;
//   inActiveIcColor: string;
// }

// const Category = (props: CategoryPropType) => {
//   const name = props.catName.replace('-', ' ');

//   return (
//     <View
//       style={[
//         style.catgoryContainer,
//         {
//           backgroundColor: props.isActive ? Colors.primary : Colors.white,
//           borderColor: props.isActive ? Colors.primary : Colors.black,
//         },
//       ]}>
//       {/* Display the category image */}
//       {props.catImage && (
//         <Image
//           source={{uri: props.catImage}}
//           style={style.categoryImage}
//           resizeMode="contain"
//         />
//       )}
//       <Text
//         style={[
//           props.isActive ? style.activeTitle : style.inactiveTtitle,
//         ]}>
//         {name}
//       </Text>
//     </View>
//   );
// };

// const style = StyleSheet.create({
//   container: {
//     marginTop: moderateScale(20),
//     marginBottom: moderateScale(10),
//   },
//   catgoryContainer: {
//     marginHorizontal: moderateScale(2),
//     paddingHorizontal: moderateScale(14),
//     backgroundColor: '#F2F4F7',
//     borderRadius: moderateScale(20),
//     flexDirection: 'row',
//     gap: moderateScale(3),
//     marginRight: moderateScale(8),
//     paddingVertical: moderateScale(8),
//     borderWidth: 1,
//     alignItems: 'center', // Ensure text and image align properly
//   },
//   categoryImage: {
//     width: moderateScale(30),
//     height: moderateScale(30),
//     borderRadius: moderateScale(15),
//   },
//   activeTitle: {
//     fontFamily: Fonts.semibold,
//     fontSize: moderateScale(14),
//     color: Colors.white,
//   },
//   inactiveTtitle: {
//     fontFamily: Fonts.regular,
//     color: Colors.black,
//     fontSize: moderateScale(14),
//   },
// });

// const MemomizedCategories = memo(Category);

// export default Categories;

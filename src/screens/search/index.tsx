// import {
//   FlatList,
//   Pressable,
//   ScrollView,
//   Text,
//   Touchable,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import SelectInput from '../../components/SelectInput';
// import {StyleSheet} from 'react-native';
// import CustomCalendar from '../../components/CustomCalendar';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
// import AppButton from '../../components/AppButton';
// import TextFeild from '../../components/TextFeild';
// import SearchBar from '../../components/SearchBar';

// import {useEffect, useMemo, useState} from 'react';
// import {StackScreenProps} from '@react-navigation/stack';
// import {useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigations/MainNavigation/models';
// import {FontStyle} from '../../config/style.config';
// import {debounce} from '../../utils/debounce';
// import {ServiceResponse} from '../../utils/interfaces';
// import {showToastMessage} from '../../utils/toast';
// import AppBottomBar from '../../components/AppBottomBar';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {Spacing} from '../../config/size.config';
// import AppImage from '../../components/AppImage';
// import {Icons} from '../../generated/image.assets';
// import BackButton from '../../components/BackButton';
// import React from 'react';

// export interface SearchPropType
//   extends StackScreenProps<RootStackParamList, 'Search'> {
//   onSelect?: (data: any) => void;
// }
// interface OptionSelectType {
//   name: string;
//   value: string;
// }
// const TestList: Array<OptionSelectType> = [
//   {
//     name: 'Test 1',
//     value: 'test 1',
//   },
//   {
//     name: 'Test 2',
//     value: 'test 2',
//   },
//   {
//     name: 'Test 3',
//     value: 'test 3',
//   },
// ];

// const Search = (props: SearchPropType) => {
//   const Nav = useNavigation();

//   const [articles, setArticles] = useState([]);
//   const [filteredArticles, setFilteredArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     // Make the API request when the component mounts
//     fetch(
//       'http://15.206.16.230:4000/api/v1/android/published-articles?search=test',
//     )
//       .then(response => response.json())
//       .then(data => {
//         if (data.status) {
//           setArticles(data.data.articles); // Set the articles from the response
//           setFilteredArticles(data.data.articles); // Initially display all articles
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching data: ', error);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleSearch = query => {
//     setSearchQuery(query);
//     if (query === '') {
//       setFilteredArticles(articles); // Show all articles if search query is empty
//     } else {
//       const filtered = articles.filter(article =>
//         article.title.toLowerCase().includes(query.toLowerCase()),
//       );
//       setFilteredArticles(filtered);
//     }
//   };

//   if (loading) {
//     return <Text>Loading...</Text>; // Show a loading text while fetching data
//   }

//   const [Places, setPlaces] = useState([]);
//   const [selectedPlace, setSelectedPlace] = useState<{
//     index?: number;
//     place?: any;
//   }>({});

//   return (
//     <>
//       <AppSafeAreaView containerStyle={{paddingHorizontal: 0}}>
//         <View style={[{paddingHorizontal: 12, paddingTop: Spacing.topSpace}]}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               marginTop: 40,
//             }}>
//             <BackButton
//               style={{marginLeft: moderateScale(12), position: 'relative'}}
//               color={Colors.black}
//               size={moderateScale(20)}
//             />
//             <SearchBar
//               placholder={'Search'}
//               label={'Search'}
//               type={'input'}
//               labelStyle={{color: Colors.gray}}
//               right={<></>}
//               left={
//                 <>
//                   <AppImage
//                     source={Icons.ic_search}
//                     style={Styles.searchIcon}
//                   />
//                 </>
//               }
//               containerStyle={Styles.search}
//             />
//           </View>
//           {
//             <View
//               style={{
//                 backgroundColor: Colors.white,
//                 borderRadius: moderateScale(10),
//                 padding: moderateScale(4),
//               }}>
//               <Text
//                 style={[
//                   FontStyle.bold,
//                   {
//                     color: Colors.black,
//                     paddingTop: moderateScale(10),
//                     fontSize: moderateScale(15),
//                   },
//                 ]}>
//                 Recent Search
//               </Text>
//               <FlatList
//                 data={filteredArticles}
//                 keyExtractor={item => item._id}
//                 renderItem={({item}) => (
//                   <View style={styles.articleContainer}>
//                     <Image
//                       source={{uri: item.urlToImage}}
//                       style={styles.articleImage}
//                     />
//                     <Text style={styles.articleTitle}>{item.title}</Text>
//                     <Text style={styles.articleDescription}>
//                       {item.description}
//                     </Text>
//                     <Text style={styles.articleCategory}>
//                       Category: {item.category}
//                     </Text>
//                   </View>
//                 )}
//               />
//             </View>
//           }
//         </View>
//       </AppSafeAreaView>
//     </>
//   );
// };
// const Styles = StyleSheet.create({
//   selectContainer: {
//     backgroundColor: 'white',
//     borderColor: 'rgba(0, 0, 0, 0.3)',
//   },
//   ctaBtn: {
//     width: '80%',
//   },
//   ctaBtnLabel: {
//     fontWeight: '600',
//   },
//   ctaIcon: {
//     width: 20,
//     height: 20,
//     resizeMode: 'contain',
//     marginHorizontal: 8,
//   },
//   searchContainer: {
//     marginVertical: 20,
//     width: '100%',
//     padding: moderateScale(12),
//     alignSelf: 'center',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 1,
//   },
//   search: {
//     backgroundColor: '#9EA0A733',
//     width: '90%',
//     padding: moderateScale(5),
//     justifyContent: 'flex-start',
//   },
//   searchIcon: {
//     width: moderateScale(20),
//     height: moderateScale(20),
//     marginRight: moderateScale(4),
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingLeft: 8,
//     borderRadius: 8,
//   },
//   articleContainer: {
//     marginBottom: 20,
//   },
//   articleImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//   },
//   articleTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 8,
//   },
//   articleDescription: {
//     fontSize: 14,
//     marginTop: 4,
//   },
//   articleCategory: {
//     fontSize: 12,
//     color: 'gray',
//     marginTop: 4,
//   },
// });

// export default Search;




import {
    FlatList,
    Text,
    View,
    Image,
    StyleSheet,
  } from 'react-native';

  import SearchBar from '../../components/SearchBar';
  import { useEffect, useState } from 'react';
  import { moderateScale } from 'react-native-size-matters';
  import { Colors } from '../../config/colors.config';
  import { Spacing } from '../../config/size.config';
  import AppImage from '../../components/AppImage';
  import { Icons } from '../../generated/image.assets';
  import BackButton from '../../components/BackButton';
  
  interface Article {
    _id: string;
    title: string;
    description: string;
    urlToImage: string;
    category: string;
  }
  
  const Search = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      fetch('http://15.206.16.230:4000/api/v1/android/published-articles?search=test')
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            setArticles(data.data.articles); 
            setFilteredArticles(data.data.articles); 
          }
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        })
        .finally(() => setLoading(false));
    }, []);
  
    const handleSearch = (query: string) => {
      setSearchQuery(query);
      if (query === '') {
        setFilteredArticles(articles); 
      } else {
        const filtered = articles.filter((article) =>
          article.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredArticles(filtered);
      }
    };
  
    if (loading) {
      return <Text>Loading...</Text>;
    }
  
    return (
     
        <View style={{ paddingHorizontal: 12, paddingTop: Spacing.topSpace }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }}>
            <BackButton style={{ marginLeft: moderateScale(12), position: 'relative' }} color={Colors.black} size={moderateScale(20)} />
            <SearchBar
              placeholder="Search"
              label="Search"
              type="input"
              labelStyle={{ color: Colors.gray }}
              right={null}
              left={<AppImage source={Icons.ic_search} style={styles.searchIcon} />}
              containerStyle={styles.search}
              onSubmit={handleSearch}
            />
          </View>
  
          <View style={{ backgroundColor: Colors.white, borderRadius: moderateScale(10), padding: moderateScale(4) }}>
            <Text style={[{ color: Colors.black, paddingTop: moderateScale(10), fontSize: moderateScale(15) }]}>Recent Search</Text>
            <FlatList
              data={filteredArticles}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.articleContainer}>
                  <Image source={{ uri: item.urlToImage }} style={styles.articleImage} />
                  <Text style={styles.articleTitle}>{item.title}</Text>
                  <Text style={styles.articleDescription}>{item.description}</Text>
                  <Text style={styles.articleCategory}>Category: {item.category}</Text>
                </View>
              )}
            />
          </View>
        </View>
  
    );
  };
  
  const styles = StyleSheet.create({
    search: {
      backgroundColor: '#9EA0A733',
      width: '90%',
      padding: moderateScale(5),
      justifyContent: 'flex-start',
    },
    searchIcon: {
      width: moderateScale(20),
      height: moderateScale(20),
      marginRight: moderateScale(4),
    },
    articleContainer: {
      marginBottom: 20,
    },
    articleImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    articleTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 8,
    },
    articleDescription: {
      fontSize: 14,
      marginTop: 4,
    },
    articleCategory: {
      fontSize: 12,
      color: 'gray',
      marginTop: 4,
    },
  });
  
  export default Search;
  
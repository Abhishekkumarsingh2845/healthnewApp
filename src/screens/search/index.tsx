
















// import React, {useEffect, useState} from 'react';
// import {
//   FlatList,
//   Text,
//   View,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import SearchBar from '../../components/SearchBar';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {Spacing} from '../../config/size.config';
// import AppImage from '../../components/AppImage';
// import {Icons} from '../../generated/image.assets';
// import BackButton from '../../components/BackButton';
// import {useNavigation} from '@react-navigation/native';
// import {Fonts} from '../../config/font.config';
// import { useGetArticles } from '../../store/article/article.hooks';

// interface Article {
//   _id: string;
//   title: string;
//   description: string;
//   urlToImage: string;
//   category: string;
// }
// const Search = () => {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation(); // Navigation hook
//   const allArticles = useGetArticles();
//   console.log('allArticles==>> in the search baaar', allArticles);

//   useEffect(() => {
//     fetchArticles();
//   }, []);

//   const fetchArticles = (query: string = '') => {
//     setLoading(true);
//     const url = `http://15.206.16.230:4000/api/v1/android/published-articles?limit=10&search=${query}`;
//     fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         if (data.status) {
//           setArticles(data.data.articles);
//           setFilteredArticles(data.data.articles);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching data: ', error);
//       })
//       .finally(() => setLoading(false));
//   };

//   // Debounce function
//   const debounce = (func: Function, delay: number) => {
//     let timeoutId: NodeJS.Timeout;
//     return (...args: any[]) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         func(...args);
//       }, delay);
//     };
//   };

//   const debouncedFetchArticles = debounce((query: string) => {
//     fetchArticles(query);
//   }, 3000); // Adjust the delay as needed

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     debouncedFetchArticles(query);
//   };

//   const handleArticlePress = (articleId: string) => {
//     navigation.navigate('NewsDetail', {_id: articleId});
//   };

//   const renderUniqueArticles = () => {
//     // Remove duplicates by titles using a Set
//     const uniqueTitles = new Set<string>();
//     const uniqueArticles = filteredArticles.filter(article => {
//       if (!uniqueTitles.has(article.title)) {
//         uniqueTitles.add(article.title);
//         return true;
//       }
//       return false;
//     });
//     return uniqueArticles;
//   };

//   if (loading) {
//     return (
//       <View style={{alignSelf: 'center', justifyContent: 'center', flex: 1}}>
//         <ActivityIndicator color={'black'} />
//       </View>
//     );
//   }

//   return (
//     <View style={{paddingHorizontal: 12}}>
//       <SafeAreaView />
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           marginTop: 20,
//         }}>
//         <BackButton
//           style={{marginLeft: moderateScale(12), position: 'relative'}}
//           color={Colors.black}
//           size={moderateScale(20)}
//         />
//         <SearchBar
//           value={searchQuery}
//           placeholder="Search"
//           label="Search"
//           type="input"
//           labelStyle={{color: Colors.gray}}
//           right={null}
//           left={<AppImage source={Icons.ic_search} style={styles.searchIcon} />}
//           containerStyle={styles.search}
//           onChange={handleSearch}
//         />
//       </View>

//       <View
//         style={{
//           borderRadius: moderateScale(10),
//           padding: moderateScale(4),
//         }}>
//         {/* <Text
//           style={[
//             {
//               color: Colors.black,
//               paddingTop: moderateScale(10),
//               fontSize: moderateScale(18),
//               fontFamily: Fonts.medium,
//               fontWeight: '700',
//             },
//           ]}>
//           Recent Search
//         </Text> */}

//         {/* Render the FlatList only if the user has searched */}
//         {searchQuery ? (
//           <FlatList
//             data={renderUniqueArticles()}
//             keyExtractor={item => item._id}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 style={{width: '100%', flexDirection: 'row', marginTop: 10}}
//                 onPress={() => handleArticlePress(item._id)}>
//                 <Image
//                   source={{uri: item.urlToImage}}
//                   style={{width: 30, height: 30, resizeMode: 'contain'}}
//                 />
//                 <Text style={styles.articleTitle}>{item.title}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         ) : (
//           <Text
//             style={{textAlign: 'center', color: Colors.gray, marginTop: 20}}>
//             {/* No articles to display. Start searching! */}
//           </Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
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
//   articleTitle: {
//     fontSize: 15,
//     fontFamily: Fonts.light,
//     fontWeight: '700',
//     marginTop: 8,
//     marginLeft: 10,
//     color: 'black',
//   },
// });

// export default Search;


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   SafeAreaView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { moderateScale } from 'react-native-size-matters';
// import SearchBar from '../../components/SearchBar';

// import {Colors} from '../../config/colors.config';
// import {Spacing} from '../../config/size.config';
// import AppImage from '../../components/AppImage';
// import {Icons} from '../../generated/image.assets';
// import BackButton from '../../components/BackButton';

// import {Fonts} from '../../config/font.config';
// import { useGetArticles } from '../../store/article/article.hooks';// Hook to fetch all articles

// const Search = () => {
//   const [articles, setArticles] = useState([]);
//   const [filteredArticles, setFilteredArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation(); // Navigation hook
//   const allArticles = useGetArticles(); // All articles from the hook
//   console.log('allArticles==>> in the search bar', allArticles);

//   useEffect(() => {
//     fetchArticles();
//   }, []);

//   const fetchArticles = (query = '') => {
//     setLoading(true);
//     const url = `http://15.206.16.230:4000/api/v1/android/published-articles?limit=10&search=${query}`;
//     fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         if (data.status) {
//           const fetchedArticles = data.data.articles;

//           // Filter articles based on matching titles with allArticles
//           const matchedArticles = fetchedArticles.filter(fetchedArticle =>
//             allArticles.some(
//               existingArticle => existingArticle.title === fetchedArticle.title
//             )
//           );

//           setArticles(matchedArticles);
//           setFilteredArticles(matchedArticles);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching data: ', error);
//       })
//       .finally(() => setLoading(false));
//   };

//   // Debounce function
//   const debounce = (func, delay) => {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         func(...args);
//       }, delay);
//     };
//   };

//   const debouncedFetchArticles = debounce((query) => {
//     fetchArticles(query);
//   }, 5000); // Adjust the delay as needed

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     debouncedFetchArticles(query);
//   };

//   const handleArticlePress = (articleId) => {
//     navigation.navigate('NewsDetail', { _id: articleId });
//   };

//   const renderUniqueArticles = () => {
//     // Remove duplicates by titles using a Set
//     const uniqueTitles = new Set();
//     const uniqueArticles = filteredArticles.filter(article => {
//       if (!uniqueTitles.has(article.title)) {
//         uniqueTitles.add(article.title);
//         return true;
//       }
//       return false;
//     });
//     return uniqueArticles;
//   };

//   if (loading) {
//     return (
//       <View style={{ alignSelf: 'center', justifyContent: 'center', flex: 1 }}>
//         <ActivityIndicator color={'black'} />
//       </View>
//     );
//   }

//   return (
//     <View style={{ paddingHorizontal: 12 }}>
//       <SafeAreaView />
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           marginTop: 20,
//         }}>
//         <BackButton
//           style={{ marginLeft: moderateScale(12), position: 'relative' }}
//           color={Colors.black}
//           size={moderateScale(20)}
//         />
//         <SearchBar
//           value={searchQuery}
//           placeholder="Search"
//           label="Search"
//           type="input"
//           labelStyle={{ color: Colors.gray }}
//           right={null}
//           left={<AppImage source={Icons.ic_search} style={styles.searchIcon} />}
//           containerStyle={styles.search}
//           onChange={handleSearch}
//         />
//       </View>

//       <View
//         style={{
//           borderRadius: moderateScale(10),
//           padding: moderateScale(4),
//         }}>
//         {searchQuery ? (
//           <FlatList
//             data={renderUniqueArticles()}
//             keyExtractor={item => item._id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}
//                 onPress={() => handleArticlePress(item._id)}>
//                 <Image
//                   source={{ uri: item.urlToImage }}
//                   style={{ width: 30, height: 30, resizeMode: 'contain' }}
//                 />
//                 <Text style={styles.articleTitle}>{item.title}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         ) : (
//           <Text
//             style={{ textAlign: 'center', color: Colors.gray, marginTop: 20 }}>
  
//           </Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = {
//   searchIcon: {
//     width: moderateScale(16),
//     height: moderateScale(16),
//     resizeMode: 'contain',
//   },
//   search: {
//     flex: 1,
//     marginHorizontal: moderateScale(8),
//   },
//   articleTitle: {
//     marginLeft: moderateScale(10),
//     fontSize: moderateScale(14),
//     color: Colors.black,
//   },
// };

// export default Search;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';
import SearchBar from '../../components/SearchBar';

import { Colors } from '../../config/colors.config';
import { Spacing } from '../../config/size.config';
import AppImage from '../../components/AppImage';
import { Icons } from '../../generated/image.assets';
import BackButton from '../../components/BackButton';

import { Fonts } from '../../config/font.config';
import { useGetArticles } from '../../store/article/article.hooks'; // Hook to fetch all articles

const Search = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  console.log("filteredArticles==>>",filteredArticles);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation(); // Navigation hook
  const allArticles = useGetArticles(); // All articles from the hook
  let debounceTimeout; // Timeout reference for debounce

  // useEffect(() => {
  //   fetchArticles(); // Fetch initial articles
  // }, []);

  const fetchArticles = (query = '') => {
    console.log("herer")
    setLoading(true);
    const url = `http://15.206.16.230:4000/api/v1/android/published-articles?limit=10&search=${query}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const fetchedArticles = data.data.articles;

          // Filter articles based on matching titles with allArticles
          const matchedArticles = fetchedArticles.filter(fetchedArticle =>
            allArticles.some(
              existingArticle => existingArticle.title === fetchedArticle.title
            )
          );

          // setArticles(matchedArticles);
          setFilteredArticles(matchedArticles);
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      })
      .finally(() => setLoading(false));
  };

 const debounce = (fn, delay) => {
  let timeOutId = null;
  return (query) => {
    if(timeOutId){
      clearTimeout(timeOutId);
    }

    timeOutId = setTimeout(() => {
      console.log("query",query)
      fn(query)
    },delay)

  }
 }

 const debouncedSearch = debounce((query) =>{
   if(query.length == 0 ) {
     return setFilteredArticles([])
   }
    fetchArticles(query); 
} , 1000)

  

  const handleArticlePress = (articleId) => {
    navigation.navigate('NewsDetail', { _id: articleId });
  };

  const renderUniqueArticles = () => {
    // Remove duplicates by titles using a Set
    if(filteredArticles.length === 0) return 
    const uniqueTitles = new Set();
    const uniqueArticles = filteredArticles.filter(article => {
      if (!uniqueTitles.has(article.title)) {
        uniqueTitles.add(article.title);
        return true;
      }
      return false;
    });
    return uniqueArticles;
  };

  // if (loading) {
  //   return (
  //     <View style={{ alignSelf: 'center', justifyContent: 'center', flex: 1 }}>
  //       <ActivityIndicator color={'black'} />
  //     </View>
  //   );
  // }

  return (
    <View style={{ paddingHorizontal: 12 }}>
      <SafeAreaView />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <BackButton
          style={{ marginLeft: moderateScale(12), position: 'relative' }}
          color={Colors.black}
          size={moderateScale(20)}
        />
        <SearchBar
          value={searchQuery}
          placeholder="Search"
          label="Search"
          type="input"
          labelStyle={{ color: Colors.gray }}
          right={null}
          left={<AppImage source={Icons.ic_search} style={styles.searchIcon} />}
          containerStyle={styles.search}
          onChange={(text) => debouncedSearch(text)}
        />
      </View>

      <View
        style={{
          borderRadius: moderateScale(10),
          padding: moderateScale(4),
        }}>
        {filteredArticles.length > 0 ? (
          <FlatList
            data={renderUniqueArticles()}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}
                onPress={() => handleArticlePress(item._id)}>
                <Image
                  source={{ uri: item.urlToImage }}
                  style={{ width: 30, height: 30, resizeMode: 'contain' }}
                />
                <Text style={styles.articleTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text
            style={{ textAlign: 'center', color: Colors.gray, marginTop: 20 }}>
         
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = {
  searchIcon: {
    width: moderateScale(16),
    height: moderateScale(16),
    resizeMode: 'contain',
  },
  search: {
    flex: 1,
    marginHorizontal: moderateScale(8),
  },
  articleTitle: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(14),
    color: Colors.black,
  },
};

export default Search;

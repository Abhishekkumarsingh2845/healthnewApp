
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
// import {useEffect, useState} from 'react';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {Spacing} from '../../config/size.config';
// import AppImage from '../../components/AppImage';
// import {Icons} from '../../generated/image.assets';
// import BackButton from '../../components/BackButton';
// import {useNavigation} from '@react-navigation/native';
// import {Fonts} from '../../config/font.config';
// import React from 'react';

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
//   useEffect(() => {
//     fetchArticles();
//   }, []);

//   const fetchArticles = (query: string = '') => {
//     setLoading(true);
//     const url = `http://15.206.16.230:4000/api/v1/android/published-articles?search=${query}`;
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
//   }, 1000); // Adjust the delay as needed

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     debouncedFetchArticles(query);
//   };

//   const clearSearchQuery = () => {
//     setSearchQuery('');
//     setFilteredArticles([]);
//   };

//   if (loading) {
//     return (
//       <View style={{alignSelf:"center",justifyContent:"center",flex:1}}>
//         <ActivityIndicator color={'black'} />
//       </View>
//     );
//   }

//   const handleArticlePress = (articleId: string) => {
//     navigation.navigate('NewsDetail', {_id: articleId});
//   };

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
//       value={searchQuery}
//           placeholder="Search"
//           label="Search"
//           type="input"
//           labelStyle={{color: Colors.gray}}
//           right={null}
//           left={<AppImage source={Icons.ic_search} style={styles.searchIcon} />}
//           containerStyle={styles.search}
//           // onSubmit={handleSearch}
//           onChange={handleSearch}
//         />
//       </View>

//       <View
//         style={{
//           borderRadius: moderateScale(10),
//           padding: moderateScale(4),
//         }}>
//         <Text
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
//         </Text>
//         <FlatList
//           data={filteredArticles}
//           keyExtractor={item => item._id}
//           renderItem={({item}) => (
//             <TouchableOpacity
//               style={{width: '100%', flexDirection: 'row', marginTop: 10}}
//               onPress={() => handleArticlePress(item._id)}
//             >
//               <Image
//                 source={{uri: item.urlToImage}}
//                 style={{width: 30, height: 30, resizeMode: 'contain'}}
//               />
//               <Text style={styles.articleTitle}>{item.title}</Text>
//             </TouchableOpacity>
//           )}
//         />
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
//   articleContainer: {
//     marginBottom: 20,
//   },
//   articleImage: {
//     width: '100%',
//     height: 100,
//     borderRadius: 8,
//   },
//   articleTitle: {
//     fontSize: 15,
//     fontFamily: Fonts.light,
//     fontWeight: '700',
//     // fontWeight:"400",
//     marginTop: 8,
//     marginLeft: 10,
//     color: 'black',
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




import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {Spacing} from '../../config/size.config';
import AppImage from '../../components/AppImage';
import {Icons} from '../../generated/image.assets';
import BackButton from '../../components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {Fonts} from '../../config/font.config';

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
  const navigation = useNavigation(); // Navigation hook

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = (query: string = '') => {
    setLoading(true);
    const url = `http://15.206.16.230:4000/api/v1/android/published-articles?limit=10&search=${query}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setArticles(data.data.articles);
          setFilteredArticles(data.data.articles);
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      })
      .finally(() => setLoading(false));
  };

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFetchArticles = debounce((query: string) => {
    fetchArticles(query);
  }, 2000); // Adjust the delay as needed

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedFetchArticles(query);
  };

  const handleArticlePress = (articleId: string) => {
    navigation.navigate('NewsDetail', {_id: articleId});
  };

  const renderUniqueArticles = () => {
    // Remove duplicates by titles using a Set
    const uniqueTitles = new Set<string>();
    const uniqueArticles = filteredArticles.filter(article => {
      if (!uniqueTitles.has(article.title)) {
        uniqueTitles.add(article.title);
        return true;
      }
      return false;
    });
    return uniqueArticles;
  };

  if (loading) {
    return (
      <View style={{alignSelf: 'center', justifyContent: 'center', flex: 1}}>
        <ActivityIndicator color={'black'} />
      </View>
    );
  }

  return (
    <View style={{paddingHorizontal: 12}}>
      <SafeAreaView />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <BackButton
          style={{marginLeft: moderateScale(12), position: 'relative'}}
          color={Colors.black}
          size={moderateScale(20)}
        />
        <SearchBar
          value={searchQuery}
          placeholder="Search"
          label="Search"
          type="input"
          labelStyle={{color: Colors.gray}}
          right={null}
          left={<AppImage source={Icons.ic_search} style={styles.searchIcon} />}
          containerStyle={styles.search}
          onChange={handleSearch}
        />
      </View>

      <View
        style={{
          borderRadius: moderateScale(10),
          padding: moderateScale(4),
        }}>
        {/* <Text
          style={[
            {
              color: Colors.black,
              paddingTop: moderateScale(10),
              fontSize: moderateScale(18),
              fontFamily: Fonts.medium,
              fontWeight: '700',
            },
          ]}>
          Recent Search
        </Text> */}

        {/* Render the FlatList only if the user has searched */}
        {searchQuery ? (
          <FlatList
            data={renderUniqueArticles()}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{width: '100%', flexDirection: 'row', marginTop: 10}}
                onPress={() => handleArticlePress(item._id)}>
                <Image
                  source={{uri: item.urlToImage}}
                  style={{width: 30, height: 30, resizeMode: 'contain'}}
                />
                <Text style={styles.articleTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{textAlign: 'center', color: Colors.gray, marginTop: 20}}>
            {/* No articles to display. Start searching! */}
          </Text>
        )}
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
  articleTitle: {
    fontSize: 15,
    fontFamily: Fonts.light,
    fontWeight: '700',
    marginTop: 8,
    marginLeft: 10,
    color: 'black',
  },
});

export default Search;











































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
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation();

//   // Function to fetch articles from the API
//   const fetchArticles = (query: string = '') => {
//     setLoading(true);
//     const url = `http://15.206.16.230:4000/api/v1/android/published-articles?search=${query}`;
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

//   // Debounce function to delay API calls during search
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
//   }, 1000);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     debouncedFetchArticles(query);
//   };

//   const handleArticlePress = (articleId: string) => {
//     navigation.navigate('NewsDetail', {_id: articleId});
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="red" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <SafeAreaView />
//       <View style={styles.header}>
//         <BackButton
//           style={styles.backButton}
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
//           containerStyle={styles.searchBar}
//           onChange={handleSearch}
//         />
//       </View>

//       <View style={styles.content}>
//         <Text style={styles.title}>Recent Search</Text>
//         {filteredArticles.length > 0 ? (
//           <FlatList
//             data={filteredArticles}
//             keyExtractor={item => item._id}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 style={styles.articleItem}
//                 onPress={() => handleArticlePress(item._id)}>
//                 <Image
//                   source={{uri: item.urlToImage}}
//                   style={styles.articleImage}
//                 />
//                 <Text style={styles.articleTitle}>{item.title}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         ) : (
//           <Text style={styles.noResultsText}></Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 12,
//     backgroundColor: Colors.white,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   backButton: {
//     marginLeft: moderateScale(12),
//     position: 'relative',
//   },
//   searchBar: {
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
//   content: {
//     borderRadius: moderateScale(10),
//     padding: moderateScale(4),
//   },
//   title: {
//     color: Colors.black,
//     paddingTop: moderateScale(10),
//     fontSize: moderateScale(18),
//     fontFamily: Fonts.medium,
//     fontWeight: '700',
//   },
//   articleItem: {
//     width: '100%',
//     flexDirection: 'row',
//     marginTop: 10,
//   },
//   articleImage: {
//     width: 30,
//     height: 30,
//     resizeMode: 'contain',
//   },
//   articleTitle: {
//     fontSize: 15,
//     fontFamily: Fonts.light,
//     fontWeight: '700',
//     marginTop: 8,
//     marginLeft: 10,
//     color: 'black',
//   },
//   noResultsText: {
//     color: Colors.gray,
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });

// export default Search;

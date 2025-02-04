
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

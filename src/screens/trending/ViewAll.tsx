// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Linking,
// } from 'react-native';
// import {useQuery} from '@realm/react';
// import {moderateScale} from 'react-native-size-matters';
// import {Fonts} from '../../config/font.config';
// import {Colors} from '../../config/colors.config';

// const ViewAll = props => {

//   const trendingArticles = useQuery('TrendingArticle');
//   console.log('-rtyuiovghjk>>>>>>', trendingArticles);
//   const [openedArticles, setOpenedArticles] = useState<Set<string>>(new Set());

//   const handleShowOriginal = (url: string, id: string) => {
//     if (openedArticles.has(id)) {
//       Linking.openURL(url);
//     } else {
//       setOpenedArticles(prev => new Set(prev).add(id));
//       props.navigation.navigate('WebViewScreen', {url});
//     }
//   };

//   const renderArticle = ({item}) => (
//     <View style={styles.articleContainer}>
//       {item.urlToImage && (
//         <Image source={{uri: item.urlToImage}} style={styles.articleImage} />
//       )}

//       <View style={styles.articleContent}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//         <Text style={styles.description}>{item.url}</Text>
//         <TouchableOpacity
//           style={styles.showOriginalButton}
//           onPress={() => handleShowOriginal(item.url, item._id)}>
//           <Text style={styles.showOriginalText}>Show Original</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {trendingArticles.isLoading ? (
//         <ActivityIndicator size="large" color="#007BFF" />
//       ) : (
//         <FlatList
//           data={trendingArticles}
//           renderItem={renderArticle}
//           keyExtractor={item => item._id.toString()}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   articleContainer: {
//     marginBottom: 20,
//     borderBottomColor: '#ddd',
//     paddingBottom: 10,
//   },
//   articleImage: {
//     width: '100%',
//     height: moderateScale(200),
//     marginBottom: moderateScale(10),
//     borderRadius: 10,
//     resizeMode: 'cover',
//   },
//   articleContent: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 5,
//     fontFamily: Fonts.medium,
//     lineHeight: 28.13,
//     color: '#000000',
//   },
//   description: {
//     fontSize: 15,
//     color: '#1D1D1D',
//     lineHeight: 23.53,
//     fontFamily: Fonts.medium,
//     marginBottom: 10,
//   },
//   showOriginalButton: {
//     width: '100%',
//     paddingHorizontal: 15,
//     marginTop: 10,
//   },
//   showOriginalText: {
//     textAlign: 'right',
//     color: Colors.primary,
//     fontSize: 14,
//     fontFamily: Fonts.medium,
//   },
// });

// export default ViewAll;







import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useQuery} from '@realm/react';
import {moderateScale} from 'react-native-size-matters';
import {Fonts} from '../../config/font.config';
import {Colors} from '../../config/colors.config';
import Header from '../news/components/header';
import {SafeAreaView} from 'react-native';

interface Article {
  _id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

interface Props {
  navigation: {
    navigate: (screen: string, params: {url: string}) => void;
  };
}

const ViewAll: React.FC<Props> = props => {
  const trendingArticles = useQuery('TrendingArticle');
  const [openedArticles, setOpenedArticles] = useState<Set<string>>(new Set());
  const params = props.route.params;

  const handleShowOriginal = (url: string, id: string) => {
    if (openedArticles.has(id)) {
      Linking.openURL(url);
    } else {
      setOpenedArticles(prev => new Set(prev).add(id));
      props.navigation.navigate('WebViewScreen', {url});
    }
  };

  const renderArticle = ({item}: {item: Article}) => (
    <View style={styles.articleContainer}>
      {item.urlToImage && (
        <Image source={{uri: item.urlToImage}} style={styles.articleImage} />
      )}

      <View style={styles.articleContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.description}>{item.url}</Text>
        <TouchableOpacity
          style={styles.showOriginalButton}
          onPress={() => handleShowOriginal(item.url, item._id)}>
          <Text style={styles.showOriginalText}>Show Original</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header />
      <View style={{marginTop: 40}}></View>
      {trendingArticles.isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={trendingArticles}
          renderItem={renderArticle}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: Article) => item._id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  articleContainer: {
    marginBottom: 20,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  articleImage: {
    width: '100%',
    height: moderateScale(200),
    marginBottom: moderateScale(10),
    borderRadius: 10,
    resizeMode: 'cover',
  },
  articleContent: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 5,
    fontFamily: Fonts.light,
    lineHeight: 28.13,
    color: '#000000',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1D',
    lineHeight: 23.53,
    fontFamily: Fonts.medium,
    // marginBottom: 10,
  },
  showOriginalButton: {
    width: '100%',
    paddingHorizontal: 15,
    // backgroundColor:"red",
   
  },
  showOriginalText: {
    textAlign: 'right',
    color: Colors.primary,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
});

export default ViewAll;

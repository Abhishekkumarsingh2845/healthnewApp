import React, {useEffect} from 'react';
import IntailizeApp from './src/components/IntializeApp';
import {RealmProvider, useRealm} from '@realm/react';
// import { realmConfig } from './src/store';
import {realmConfig} from './src/store';
function App(): React.JSX.Element {
  return (
    <RealmProvider schema={realmConfig}  deleteRealmIfMigrationNeeded={true} >
      <IntailizeApp />
    </RealmProvider>
  );
}

export default App;






// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
// import axios from "axios";

// interface Article {
//   _id: string;
//   article_id: string;
//   title: string;
//   description: string;
//   url: string;
//   urlToImage: string;
//   content: string;
//   category: string;
//   status: string;
//   isActive: boolean;
//   isTrending: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// const App: React.FC = () => {
//   const [category, setCategory] = useState<string>("Physical Health"); // Default category
//   const [data, setData] = useState<Article[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   const categories: string[] = ["Physical Health", "Technology Health"]; // Add more categories as needed

//   const fetchData = async (selectedCategory: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.get<{ data: { articles: Article[] } }>(
//         "http://15.206.16.230:4000/api/v1/android/filterData/",
//         {
//           params: { category: selectedCategory },
//         }
//       );
//       setData(response.data.data.articles || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data initially or when category changes
//   useEffect(() => {
//     fetchData(category);
//   }, [category]);

//   const renderArticle = ({ item }: { item: Article }) => (
//     <View style={styles.articleCard}>
//       <Image source={{ uri: item.urlToImage }} style={styles.articleImage} />
//       <Text style={styles.articleTitle}>{item.title}</Text>
//       <Text style={styles.articleDescription}>{item.description}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Category Buttons */}
//       <View style={styles.buttonContainer}>
//         {categories.map((cat) => (
//           <TouchableOpacity
//             key={cat}
//             style={[
//               styles.categoryButton,
//               category === cat && styles.activeCategoryButton,
//             ]}
//             onPress={() => setCategory(cat)}
//           >
//             <Text
//               style={[
//                 styles.categoryButtonText,
//                 category === cat && styles.activeCategoryButtonText,
//               ]}
//             >
//               {cat}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Articles List */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
//       ) : (
//         <FlatList
//           data={data}
//           keyExtractor={(item) => item._id}
//           renderItem={renderArticle}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginTop:40,
//     justifyContent: "space-around",
//     marginBottom: 10,
//   },
//   categoryButton: {
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: "#ccc",
//   },
//   activeCategoryButton: {
//     backgroundColor: "#007BFF",
//   },
//   categoryButtonText: {
//     color: "#000",
//     fontSize: 16,
//   },
//   activeCategoryButtonText: {
//     color: "#fff",
//   },
//   articleCard: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: "#f9f9f9",
//   },
//   articleImage: {
//     width: "100%",
//     height: 150,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   articleTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   articleDescription: {
//     fontSize: 14,
//     color: "#666",
//   },
//   loading: {
//     marginTop: 20,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
// });

// export default App;



























































// import React from 'react';
// import {View, Text, Button, StyleSheet} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {WebView} from 'react-native-webview';

// type RootStackParamList = {
//   Home: undefined;
//   WebViewScreen: {url: string};
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const HomeScreen = ({navigation}: any) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to the Home Screen!</Text>
//       <Button
//         title="Go to WebView"
//         onPress={() =>
//           navigation.navigate('WebViewScreen', {
//             url: 'https://www.npmjs.com/package/react-native-webview',
//           })
//         }
//       />
//     </View>
//   );
// };

// const WebViewScreen = ({route}: any) => {
//   const {url} = route.params;
//   console.log("->>>>",url);
//   return <WebView source={{uri: 'https://www.npmjs.com/package/react-native-webview'}} style={{flex: 1}} />;
// };


// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
// });

// export default App;

import axios from 'axios';
import Realm from 'realm';
import { Article } from './trending.schema';

const fetchArticles = async () => {
  try {
    const response = await axios.get('http://15.206.16.230:4000/api/v1/android/trendingarticle');
    
    const data = response.data.data; // Extract articles array from the response
    if (data.length > 0) {
      // Open a Realm instance and store the articles
      const realm = await Realm.open({
        path: 'articles.realm',
        schema: [Article],
      });

      realm.write(() => {
        data.forEach((article: any) => {
          // Save each article into Realm
          realm.create('Article', {
            _id: article._id,
            article_id: article.article_id,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: new Date(article.publishedAt),
            content: article.content,
            category: article.category,
            status: article.status,
            isActive: article.isActive,
            isTrending: article.isTrending,
          }, 'modified');
        });
      });
      
      realm.close();
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

export { fetchArticles };

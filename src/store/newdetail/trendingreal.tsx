// ArticleSchema.js
import Realm from 'realm';

const ArticleSchema = {
  name: 'Article',
  properties: {
    id: 'int',           // Unique identifier for each article
    title: 'string',     // Title of the article
    description: 'string', // Description of the article
    imageUrl: 'string?', // Image URL (optional)
    content: 'string?',  // Content of the article (optional)
    type: 'string',      // Type of article (e.g., Latest, Favourite, etc.)
  },
  primaryKey: 'id',  // Ensuring 'id' is unique
};

export default ArticleSchema;

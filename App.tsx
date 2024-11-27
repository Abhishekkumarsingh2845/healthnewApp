import React, { useEffect } from 'react';
import IntailizeApp from './src/components/IntializeApp';
import { RealmProvider } from '@realm/react';
// import { realmConfig } from './src/store';
import { initializeRealm } from './src/store/article/article.service';
import { realmConfig } from './src/store';
function App(): React.JSX.Element {



  return (
    <RealmProvider schema={realmConfig}>
      <IntailizeApp />
    </RealmProvider>
  );
}



export default App;

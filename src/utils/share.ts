import Share, { ShareOptions } from 'react-native-share';
import { showToastMessage } from './toast';

export const socialShare = (options:ShareOptions)=>{
    Share.open(options)
    .then((res) => {
    })
    .catch((err) => {
      showToastMessage(err, 'error')
    });
}
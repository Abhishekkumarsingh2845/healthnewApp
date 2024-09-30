import Clipboard from '@react-native-community/clipboard';
import { showToastMessage } from './toast';

export const CopyText = (text:string)=>{
    Clipboard.setString(text);
    // showToastMessage('text copied ','success')
}
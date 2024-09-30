import { ServiceResponse } from "./interfaces";
import DocumentPicker, { types } from 'react-native-document-picker';
export const openFilePicker = async (): Promise<ServiceResponse> => {
    try {
        const res = await DocumentPicker.pick(
            {
                presentationStyle: 'fullScreen',
                type: [types.pdf, types.images],
                
            }
        )
        // console.log("function", res)
        return { status: true, response: res[0], message: 'selected image data' }
    } catch (error) {
        // console.log(error, 'error...');
        return { status: false, response: error, message: 'Something went wrong in openGallery method' }
    }

}
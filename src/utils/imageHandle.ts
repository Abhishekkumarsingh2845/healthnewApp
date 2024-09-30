import ImageCroper from 'react-native-image-crop-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { ServiceResponse } from './interfaces';
import { Colors } from '../config/colors.config';
import { Platform } from 'react-native';
import { requestUserPermission } from './permission';
import { PERMISSIONS } from 'react-native-permissions';

export const openGallery = async (): Promise<ServiceResponse> => {
    try {
        const res = await launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.5,
                maxHeight: 300,
                maxWidth: 300
            }
        )
        // console.log("function", res)
        return { status: true, response: res.assets, message: 'selected image data' }
    } catch (error) {
        // console.log(error, 'error...');
        return { status: false, response: error, message: 'Something went wrong in openGallery method' }
    }

}
export const openCamera = async (): Promise<ServiceResponse> => {
    try {
        if (Platform.OS == 'android') {
            const res = await requestUserPermission(PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA);
            if(!res){
                return{
                    status: false,  message: 'Camera permission is not granted'
                }
            }
        }
        const res = await launchCamera(
            {
                mediaType: 'photo',
            }
        )

        return { status: true, response: res.assets, message: 'selected image data' }
    } catch (error) {
        // console.log(error, 'error...');
        return { status: false, response: error, message: 'Something went wrong in openCamera method' }
    }
}

export const openImgCropper = async (path: any): Promise<ServiceResponse> => {
    try {

        const res = await ImageCroper.openCropper({
            path: path,
            width: 300,
            height: 300,
            mediaType: 'photo',
            cropperToolbarWidgetColor: Colors.primary,
            cropperToolbarTitle: 'Crop Profile Image',
            cropperStatusBarColor: 'black',
            cropperToolbarColor: 'white',
            cropperCircleOverlay: true,
            hideBottomControls: true,
            freeStyleCropEnabled: true
        });
        // console.log(res, 'res of cropped image')
        return { status: true, response: res, message: 'Cropped Image Data' }

    } catch (error) {
        // console.log(error, 'error of cropped image')
        return { status: false, response: error, message: 'Something went wrong in openCropepr method' }
    }

}
import Toast from 'react-native-toast-message';

export const showToastMessage = (message: string | undefined, type: string) => {
    Toast.show({
        type: type,
        text1: 'Message',
        text2: (message) ? message : 'something went wrong'
    });
}
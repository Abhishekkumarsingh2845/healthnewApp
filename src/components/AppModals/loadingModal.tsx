import { Image, StyleSheet, Text, View } from "react-native";
import AppBlurModal, { AppBlurModalPropType } from "../AppBlurModal";
import { FontStyle, Style } from "../../config/style.config";
import AppImage from "../AppImage";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { Fonts } from "../../config/font.config";
import { ActivityIndicator } from "react-native-paper";



interface LoadingModalPropType extends AppBlurModalPropType {
}



const LoadingModal = (props: LoadingModalPropType) => {
    return (
        <AppBlurModal {...props}
            modalStyle={{ backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }}
        >
            <View style={style.loadingContainer}>
                <View className="p-4">
                    <ActivityIndicator size={moderateScale(40)} />
                    <Text className="pt-2 text-center" style={FontStyle.titleSemibold} >Loading</Text>
                </View>
            </View>
        </AppBlurModal>
    )
}

const style = StyleSheet.create({
    contentConatainer: {
        // flex:1,
        paddingHorizontal: moderateScale(4),
        paddingVertical: moderateScale(25),
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red',

    },
    btnStyle: {
        width: '40%',
        borderRadius: moderateScale(10),

    },
    loadingContainer: {
        width: moderateScale(100),
        borderRadius: moderateScale(4),
        alignSelf: 'center',
        backgroundColor: Colors.white,
        justifyContent: 'space-around'
    },
    borderedBtn: {
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: 'transparent'
    },
    desc: {
        width: '60%',
        fontFamily: Fonts.regular,
        fontSize: moderateScale(14),
        paddingVertical: moderateScale(4),
        color: '#555555',
        textAlign: 'center',
        lineHeight: moderateScale(23),

    },
    profile: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(60),
        marginTop: moderateScale(16),
        marginBottom: moderateScale(12)
    }
})
export default LoadingModal;
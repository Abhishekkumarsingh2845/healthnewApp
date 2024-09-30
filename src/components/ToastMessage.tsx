import { SCREEN_HEIGHT } from "@config/constants";
import { Animated, Text, View } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { s } from "react-native-wind";
import FoundationIcon from 'react-native-vector-icons/Foundation';
import { getThemeColorByUserType } from "@utils/colorFun";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { useEffect, useRef } from "react";
const ToastMessage = () => {
    const userStore = useSelector((state: RootState) => state.user.data);
    const ThemeColor = getThemeColorByUserType(userStore.currentAccType)
    const AnimatedView = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(AnimatedView, {
            toValue: 100,
            duration: 1000,
            useNativeDriver: true
        }).start()
    }, [])
    const toastConfig: ToastConfig = {
        custom: ({ text1, props, text2 }) => {

            return (
                <View style={{
                    width: '90%', backgroundColor: 'white', borderRadius: 6,
                    elevation: 3,
                    overflow: 'hidden'
                }}>
                    <View style={s`px-2 py-1`}>

                        <View style={s`pb-1 flex-row items-center pb-1`}>
                            <FoundationIcon name={'info'} color={ThemeColor} size={20} />
                            <Text style={[s`mx-2 text-md `, { color: ThemeColor }]}>Toast Message</Text>
                        </View>
                        <Text style={s`capitalize text-md`} > <Text style={s`text-green-500   `} >{text1}: </Text>{text2}</Text>
                    </View>
                    <View style={s`overflow-hidden mt-2`}>
                        <Animated.View style={[, { backgroundColor: 'white', padding: 2, }]} />
                    </View>
                </View>

            )
        }
    };
    return (
        <Toast
            config={toastConfig}
            position='bottom'
            // autoHide={false}
            bottomOffset={SCREEN_HEIGHT * 0.05}
        />
    )
}

export default ToastMessage;
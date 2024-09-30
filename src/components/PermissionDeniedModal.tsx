import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from "react-native"
import AppPopup from "@components/AppPopup"
import AppButton from "@components/AppButton"
import { PRIMARY_COLOR } from "@config/colors"
import { s } from "react-native-wind"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RootState } from '@store/index'
import { useSelector } from 'react-redux'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { getThemeColorByUserType } from '@utils/colorFun'
import { AppState } from 'react-native'
import { requestUserPermission } from '@utils/permission'
import { PERMISSIONS, openSettings } from 'react-native-permissions'
interface PermissionDeniedModalType {
    visible: boolean;
    setVisible: (data: any) => any
}
const PermissionDeniedModal = (props: PermissionDeniedModalType) => {

    const { visible, setVisible } = props;
    const UserStore = useSelector((state: RootState) => state.user);
    const themeColor = getThemeColorByUserType(UserStore.data.currentAccType);
    const OpenSetting = ()=>{
        openSettings()
        
    }
    
    useEffect(()=>{
        const id = AppState.addEventListener('change', async (state)=>{
            const isGranted = await requestUserPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if( isGranted){setVisible(false); id.remove()}
        });
        return(()=>{
            // console.log('remove..id ')
            id.remove()
        });
    })
    return (
        <AppPopup visable={visible} setVisable={setVisible}
            icon={<></>}
            title={"Allow Your Location"}
            isPermenent={true}>
            <View style={[s`px-4 py-2`]} >
                <EntypoIcon
                    name={'location'}
                    size={40}
                    style={[s`self-center my-2`]}
                    color={themeColor}
                />
                <Text style={[s`text-black text-base text-center p-2`]} >
                    we will need your location to give you better experience
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', paddingBottom: 16 }}>
                    <AppButton
                        btnstyle={{...Styles.callToActBtn ,backgroundColor:themeColor}}
                        textStyle={Styles.callToActBtnLabel}
                        label={'Open Setting'} loading={false} onClick={OpenSetting} />

                </View>
            </View>
        </AppPopup>
    )
}

const Styles = StyleSheet.create({


    callToActBtn: {
        width: '70%',
        height: 40,
        paddingVertical: 0,
        backgroundColor: PRIMARY_COLOR,
        elevation: 0,
    },
    callToActBtnLabel: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
})

export default PermissionDeniedModal;
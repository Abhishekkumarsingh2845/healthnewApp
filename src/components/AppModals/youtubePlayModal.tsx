import { useCallback, useState } from "react";
import YoutubePlayer, { PLAYER_STATES } from "react-native-youtube-iframe";
import AppBlurModal, { AppBlurModalPropType } from "../AppBlurModal";
import { Pressable, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Size } from "../../config/size.config";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from "../../config/colors.config";
interface YouTubePlayModalPropType extends AppBlurModalPropType {
    videoId:string
}
const YouTubePlayModal = (props: YouTubePlayModalPropType) => {
    const [playing, setPlaying] = useState(false);
    const onStateChange = useCallback((state: PLAYER_STATES) => {
        if (state === "ended") {
            setPlaying(false);
        }
        if(state === 'playing'){
                setPlaying(true);
        }
    }, []);
    return (
        <>
            <AppBlurModal {...props}
                modalStyle={{backgroundColor:'transparent',elevation:0, shadowOpacity:0}}
            >
                <View>
                <Pressable style={style.cross} onPress={()=>{
                        props.modalClose(false);
                    }} >
                        <AntDesign name={'close'} size={moderateScale(16)} />
                    </Pressable>
                <YoutubePlayer
                    width={Size.screenWidth * 0.9}
                    play={playing}
                    videoId={props.videoId}
                    onChangeState={onStateChange} height={200} />
                </View>


            </AppBlurModal>


        </>
    )
}
const style = StyleSheet.create({
    contentConatainer: {
        // flex:1,

        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red',

    },
    cross: {
        borderRadius: 100,
        alignSelf:'center',
        backgroundColor: Colors.white,
        padding: moderateScale(6),
        marginBottom: moderateScale(10)
    },
})
export default YouTubePlayModal
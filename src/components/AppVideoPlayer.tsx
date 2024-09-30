import { useIsFocused } from '@react-navigation/native';
import { duration } from 'moment';
import { Dispatch, SetStateAction, memo, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Video, { VideoRef } from 'react-native-video';

interface AppVideoPlayerPropType {
    activeIndex: number,
    index: number,
    url: string,
    scrollToNext:()=>void

}

const AppVideoPlayer = memo((props: AppVideoPlayerPropType) => {
    const videoRef = useRef<VideoRef>(null);
    const isFocused = useIsFocused();
    const [playing, setPlaying] = useState(false);
    const videoDuration = useRef<number>(0);
    const [isMute, setIsMute] = useState(true);
    useEffect(() => {
        const playing = !(props.activeIndex == props.index)
        if (!playing) {
            const secDuration = videoDuration.current / 1000;
            videoRef.current?.getCurrentPosition().then((duration) => {
                if (duration >= secDuration - 10) {
                    videoRef.current?.seek(0);
                }
            })
        }
        setPlaying(playing)
    }, [props.activeIndex])
    useEffect(()=>{
        if(!isFocused){
            setPlaying(true)
        }
    },[isFocused])
    return (
        <View className='flex-1 relative '>
            <Video
                // Can be a URL or a local file.
                source={{ uri: props.url }}
                // Store reference  
                ref={videoRef}
                onLoad={(data) => {
                    videoDuration.current = data.duration * 1000;
                }}
                onEnd={props.scrollToNext}
                muted={isMute}
                paused={playing}
                style={style.container}
            />
            <View className='flex-1 absolute '
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
                <IconButton
                    icon={(isMute) ? 'volume-off' : 'volume-high'}
                    onPress={() => {
                        setIsMute(!isMute)
                    }}
                    className='right-0 absolute '
                    style={{ backgroundColor: 'rgba(255, 255, 255,0.7)' }}
                />
                <IconButton
                    icon={(playing) ? 'play' : 'pause'}
                    onPress={() => {
                        setPlaying(!playing)
                    }}
                    className='bottom-0 absolute '
                    style={{ backgroundColor: 'rgba(255, 255, 255,0.7)' }}
                />
            </View>
        </View>
    )
});
const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    }
})
export default AppVideoPlayer
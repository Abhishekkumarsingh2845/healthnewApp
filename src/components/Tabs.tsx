import { Animated, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Size } from "../config/size.config";
import { Colors } from "../config/colors.config";
import { Fonts } from "../config/font.config";
import { moderateScale } from "react-native-size-matters";
interface TabPropsType {
    tabs: Array<singleTabType>,
    tabContainerStyle?: ViewStyle,
    labelStyle?: TextStyle,
    translateWidth?: number,
    initalIndex?: number
}
export type singleTabType = {
    name: string,
    component: ReactNode,
}
const Tab = (props: TabPropsType) => {
    const SliderBar = useRef(new Animated.Value(0)).current;
    const [activeIndex, setActiveIndex] = useState(props.initalIndex ?? 0);
    const moveWidth = props.translateWidth ? props.translateWidth : Size.screenWidth * 0.45
    // const SliderBar = new Animated.Value(0);
    const TextRef = useRef<Array<Text>>([]);
    const TabsRef = useRef<Array<View>>([]);
    const changeTab = (index: number) => {
        for (let i = 0; i < TextRef.current.length; i++) {
            TextRef.current[i].setNativeProps({ style: { color: Colors.black } })

        }
        TextRef.current[index].setNativeProps({ style: { color: 'white' } })
        // console.log('Change index', index);
        setActiveIndex(index);
        Animated.spring(SliderBar, {
            toValue: (index == 0) ? 0 : moveWidth,
            useNativeDriver: true
        }).start();

    }
    useEffect(() => {
        if (props.initalIndex) {
            changeTab(props.initalIndex)
        }
    }, [props.initalIndex])
    return (
        <>
            <View style={[style.tabContainer, props.tabContainerStyle]}>
                <View style={{ flexDirection: 'row', }}>

                    {
                        props.tabs.map((item, index) => {
                            return (
                                <Pressable key={item.name} style={style.pressableLabel} onPress={() => { changeTab(index); }}>
                                    {/* 
                                    // @ts-ignore */}
                                    <Text ref={(el) => TextRef.current[index] = el} style={[style.label, props.labelStyle, { color: (index == 0) ? 'white' : 'rgba(23, 23, 23, 1)' }]}>{item.name}</Text>
                                </Pressable>
                            )
                        })
                    }
                    <Animated.View style={[style.bar, { transform: [{ translateX: SliderBar }] }]} />
                </View>
            </View>
            <>
                {
                    props.tabs[activeIndex].component
                }
            </>

        </>
    )
}
const style = StyleSheet.create({
    tabContainer: {
        backgroundColor: '#EBEBEB',
        position: 'relative',
        borderRadius: 100,
        paddingVertical: 6,
        paddingHorizontal: 8,
        // overflow:'hidden'

    },
    pressableLabel: {
        width: '50%',
        zIndex: 2,
        paddingVertical: "3%"
    },
    label: {
        fontFamily: Fonts.medium,
        fontSize: moderateScale(12),
        textAlign: 'center',
        color: 'white',
    },
    bar: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: Colors.primary,
        width: '50%',

        borderRadius: 100,
        height: '100%',
        zIndex: 0

    }
})
export default Tab;
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import Animated, { FadeIn, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { Size } from '../config/size.config';
import { BlurView, BlurViewProps } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';


export interface AppBlurModalPropType {
    modalOpenFlag: boolean,
    modalClose: (flag: boolean) => void,
    children?: ReactNode,
    modalStyle?: ViewStyle,
    blurAmount?: number,
    isSticky?: boolean,
    onRequestClose?: () => void
    blurType?: 'dark' | 'light' | 'xlight';
}

const AppBlurModal = ({
    modalOpenFlag,
    modalClose,
    children,
    modalStyle,
    blurType = 'light',
    blurAmount = 1,
    onRequestClose
}: AppBlurModalPropType) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            statusBarTranslucent={false}
            visible={modalOpenFlag}
            onRequestClose={() => {
                if (onRequestClose) {
                    onRequestClose()
                    return;
                }
                modalClose(!modalOpenFlag)
            }}
        >
            <BlurView blurType={blurType} blurAmount={blurAmount} style={styles.centeredView}>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={styles.box}
                    >
                        <Animated.View entering={FadeIn.duration(500)} style={[styles.modalView, modalStyle]} >

                            <View style={{ width: '100%' }}>
                                {
                                    children
                                }
                            </View>
                        </Animated.View>
                    </View>
                </ScrollView>
            </BlurView>
            {
                //@ts-ignore
                <Toast swipeable={false} />
            }
        </Modal>
    )
}

export default AppBlurModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        height: Size.screenHeight,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: "center",
        alignItems: "center"
    },
    box: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    modalView: {
        width: Size.screenWidth * 0.90,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 24
    },
    img: {
        width: scale(108),
        height: scale(108),
    },
    buttonRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
})
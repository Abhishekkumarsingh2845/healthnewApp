import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import AppImage from "../AppImage";
import { Icons } from "../../generated/image.assets";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { FontStyle, Style } from "../../config/style.config";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EntypoIcons from 'react-native-vector-icons/Entypo'
import { Size } from "../../config/size.config";
import Article from "../../store/article/article.schema";
import { ArticleType } from "../../store/article/article.interface";
import moment from "moment";
import { memo, useCallback } from "react";
import { useToggleLikeArticle } from "../../store/article/article.hooks";

interface CardPropType extends ArticleType {
    containerStyle?: ViewStyle,
    onClick?: () => void
}
const Card = (props: CardPropType) => {
    const {toggleLike} = useToggleLikeArticle();
    const onLike = useCallback(()=>{
            toggleLike(props._id);
    },[props._id])
    return (
        <>
            <Pressable style={[style.box, props.containerStyle]} onPress={props.onClick}>
                <View style={style.container}>
                    <AppImage source={{ uri: props.urlToImage }} style={style.image} resizeMode={'stretch'} />
                    {/* Overlay */}
                    <View style={style.overlay}>
                        <View style={[Style.flexRow, { justifyContent: 'space-between' }]}>
                            <View style={[Style.flexRow]}>
                                <View style={style.iconContainer}>
                                    <Image source={Icons.ic_fitness} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </View>
                                <Text style={[FontStyle.titleSemibold, style.label]}>{props.category}</Text>
                            </View>
                            <View style={[Style.flexRow, { gap: moderateScale(7) }]}>

                                <Pressable  style={[style.iconContainer, style.otherIconsContainer]}>
                                    <Image source={Icons.ic_share} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </Pressable>
                                <Pressable onPress={onLike} style={[style.iconContainer, style.otherIconsContainer]}>
                                    <Image source={(props.isLiked)?Icons.ic_active_love: Icons.ic_love} style={style.icon} resizeMode={'contain'} tintColor={Colors.white} />
                                </Pressable>
                            </View>
                        </View>
                        <View>
                            <View style={[Style.flexRow, { gap: moderateScale(3) }]}>
                                <Ionicons name={'time-outline'} size={moderateScale(20)} color={Colors.white} />
                                <Text style={[FontStyle.regular, { color: Colors.white, fontSize: moderateScale(12) }]}>{moment(props.publishedAt).fromNow()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Style.flexRow, { padding: moderateScale(5), alignItems: 'center', gap: moderateScale(10) }]}>
                    <Text style={[FontStyle.bold, { color: Colors.black, justifyContent: 'space-between', fontSize: moderateScale(18) }]}>
                        {props.title}
                    </Text>
                    {/* <View style={[Style.flexRow, { gap: moderateScale(4), flex: 1, justifyContent: 'flex-end' }]}>
                        <View style={{ borderWidth: 1, borderColor: Colors.borderColor, padding: moderateScale(6), borderRadius: moderateScale(20) }}>
                            <Image source={Icons.ic_like} resizeMode={'contain'} style={{ width: moderateScale(16), height: moderateScale(16) }} />
                        </View>
                        <Text style={[FontStyle.title, { color: Colors.gray, fontSize: moderateScale(20) }]} >2</Text>
                    </View> */}
                </View>
                <View>
                    <Text numberOfLines={2} style={[FontStyle.titleSemibold, { padding: moderateScale(3), lineHeight: moderateScale(20), color: '#1D1D1D' }]}>
                        {props.description}
                    </Text>
                    <View style={Style.flexRow}>
                        <Text style={[FontStyle.bold, { color: Colors.primary, fontSize: moderateScale(14) }]}>Read more</Text>
                        <EntypoIcons name="chevron-small-right" color={Colors.primary} size={moderateScale(25)} />
                    </View>
                </View>
            </Pressable>
        </>
    )
}

const style = StyleSheet.create({
    box: {
        width: Size.screenWidth * 0.85,
        marginVertical: moderateScale(12),
        backgroundColor: '#F5FFFD',
        padding: moderateScale(12),
        elevation: 3,
        borderRadius: moderateScale(20),
        marginHorizontal: moderateScale(6),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

    },
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: moderateScale(15),

    },
    image: {
        width: '100%',
        height: moderateScale(170),
    },
    overlay: {
        padding: moderateScale(12),
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#0000004D',
        justifyContent: 'space-between'
    },
    icon: {
        width: moderateScale(16),
        height: moderateScale(16)
    },
    iconContainer: {
        backgroundColor: Colors.black,
        padding: moderateScale(6),
        borderRadius: moderateScale(100)
    },
    label: {
        paddingHorizontal: moderateScale(4),
        color: Colors.white,
        textTransform:'capitalize'
    },
    otherIconsContainer: {
        backgroundColor: '#0000006D'
    }
})

export default memo(Card);
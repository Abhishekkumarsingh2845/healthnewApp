import { ReactNode } from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from "../config/colors.config";
import { Style } from "../config/style.config";
import { Fonts } from "../config/font.config";
interface CategorySectionProps {
    containerStyle?: ViewStyle,
    titleStyle?: TextStyle,
    moreStyle?: TextStyle
    title?: String,
    left?: ReactNode,
    children: ReactNode,
    gradient?: Array<string | number>,
    prefixAtTitle?:ReactNode,
    headerContainerStyle?:ViewStyle,
    onViewAllPress?: () => void
}
const CategorySection = (props: CategorySectionProps) => {
    // console.log(props.children)
    const Com = () => props.children;
    return (
        <View style={[styles.container, props.containerStyle]}>

            <Header
                title={props.title}
                titleStyle={props.titleStyle}
                moreStyle={props.moreStyle}
                left={props.left}
                onViewAllPress={props.onViewAllPress}
                {...props}
            />
            <View>
                <Com />
            </View>
        </View>
    )



}
interface HeaderPropType {
    title?: String,
    titleStyle?: TextStyle,
    left?: ReactNode,
    onViewAllPress?: () => void,
    moreStyle?: TextStyle,
    prefixAtTitle?:ReactNode,
    headerContainerStyle?:ViewStyle
}
const Header = ({ title, titleStyle, left, onViewAllPress, moreStyle, prefixAtTitle, headerContainerStyle }: HeaderPropType) => {
    return (
        (title) && <>
            <View style={[styles.topBarContainer,headerContainerStyle]}>
                <View  style={[Style.flexRow,]}>
                {
                    prefixAtTitle
                }
                <Text style={[styles.title, titleStyle]} >{title}</Text>
                </View>
                {
                    (left) &&
                    <TouchableOpacity onPress={onViewAllPress} style={[Style.flexRow]}>
                        <Text style={[styles.more, moreStyle]}>View All</Text>
                        <AntDesign
                            name={'arrowright'}
                            size={moderateScale(15)}
                            color={Colors.black}

                        />
                    </TouchableOpacity>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    topBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal: moderateScale(14),
    },
    title: {
        // Font,
        fontFamily: Fonts.bold,
        fontSize: moderateScale(17),
        textTransform: 'capitalize'

    },
    more: {
        
        fontSize: moderateScale(12),
        fontFamily: Fonts.regular,
        color: Colors.black,
        textTransform: 'capitalize',
        marginHorizontal: moderateScale(4)
    }
});
export default CategorySection;
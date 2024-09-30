import { StyleSheet, View, ViewStyle } from "react-native";
import AppButton, { AppButtonPropsType } from "./AppButton";
import { Colors } from "../config/colors.config";
import { Spacing } from "../config/size.config";
import { moderateScale } from "react-native-size-matters";
interface AppBottomBarPropType extends AppButtonPropsType {
    barContainerStyle?: ViewStyle
}
const AppBottomBar = ({ barContainerStyle, ...AppButtonProps }: AppBottomBarPropType) => {
    return (
        <>
            <View style={[styles.container, barContainerStyle,]}>
                <AppButton {...AppButtonProps} />
            </View>
        </>
    )

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        paddingHorizontal: moderateScale(12),
        paddingBottom: Spacing.bottomSpace,
        borderTopColor:'#A1A1A11F',
        borderTopWidth:2,
        
    }
})
export default AppBottomBar;
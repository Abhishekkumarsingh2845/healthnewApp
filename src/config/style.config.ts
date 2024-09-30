import { StyleSheet } from "react-native";
import { Fonts } from "./font.config";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "./colors.config";

export const Style = StyleSheet.create({
    flexMiddle:{
        alignItems:'center',
        justifyContent:'center'
    },
    flexOne:{
        flex:1
    },
    flexAlignCenter:{
        alignItems:'center'
    },
    flexRow:{
        flexDirection:'row',
        alignItems:'center',
        flexWrap:'wrap'
    },
    AppSafeaAreaViewPaddingTop0:{
        paddingTop:0
    },
    fullWidth:{
        width:'100%'
    },
    imagePlaceholderStyle:{
        backgroundColor:Colors.borderColor,
    }
    
});

export const FontStyle = StyleSheet.create({
    title:{
        fontFamily:Fonts.medium,
        fontSize:moderateScale(14),
    },
    titleSemibold:{
        fontFamily:Fonts.semibold,
        fontSize:moderateScale(14),
    },
    bold:{
        fontFamily:Fonts.bold,
        fontSize:moderateScale(17),
    },
    regular:{
        fontFamily:Fonts.regular,
        fontSize:moderateScale(14), 
        
    }
})
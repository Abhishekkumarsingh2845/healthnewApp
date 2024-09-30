import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native"
import Entypo from 'react-native-vector-icons/Entypo';
import { useState } from "react";
import { Colors } from "../config/colors.config";
interface CheckBoxPropType{
    intialValue?:boolean,
    checkboxStyle?:ViewStyle,
    checkedBg?:string,
    notCheckedBg?:string,
    onValueChange?:(value:boolean)=>void
}
const CheckBox = ({onValueChange, checkboxStyle, checkedBg= Colors.primary, notCheckedBg = '#F2F4F7',intialValue}:CheckBoxPropType) => {
    const [checked, setChecked] = useState(intialValue);
    return (
        <TouchableOpacity
            onPress={() => {
                // setChecked(!checked);
                if(onValueChange){
                    onValueChange!(!checked);
                }
            }}
            style={[Styles.box, checkboxStyle, { backgroundColor: intialValue ? checkedBg : notCheckedBg }]} >
            <Entypo name="check" color={'#ffff'} />
        </TouchableOpacity>
    )
}

const Styles = StyleSheet.create({
    box: {
        width: 20,
        height: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginHorizontal: 4,
        borderWidth:1,
        borderColor: 'rgba(219, 219, 219, 1)'
    }
});

export default CheckBox;

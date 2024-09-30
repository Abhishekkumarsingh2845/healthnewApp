import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle, TouchableWithoutFeedback, Platform, Pressable } from "react-native";


import { ReactNode, useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons"
import { Colors } from "../config/colors.config";
import { Fonts } from "../config/font.config";
import { moderateScale } from "react-native-size-matters";




export interface TextFeildPropsType extends TextInputProps {
    error: any,
    setValue?: (name: string, value: any) => any,
    left: ReactNode,
    editable: boolean,
    label: string,
    name: string,
    multiline?: boolean,
    type?: string
    textInputStyle?: TextStyle,
    labelStyle?: TextStyle,
    textContianerStyle?: ViewStyle,
    right?: ReactNode,
    callOnStop?: boolean,
    userNumber?: number,
    options?: Array<string>,
    onBlur?: (data: any) => void,

}
const TextFeild = (props: TextFeildPropsType) => {
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [value, setValue] = useState('');
    const FormFeildRef = useRef<Array<any>>([]);


    ;

    const onChange = (value: string): void => {
        //@ts-ignore
        if (props.setValue) {
            props.setValue(props.name, value);
        }
        setValue(value)
        // props.callOnStop &&
        // // handleTypingStopped.cancel();
        // props.callOnStop &&
        // handleTypingStopped(value , setErrorMsg, props.setValue, UserStore.token);
        // if(!value){
        //     setErrorMsg('')
        // }

    }

    const handleHide = () => {
        setShowPassword(!showPassword)
    }



    return (
        <View >
            {
                (props.label) &&
                <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
            }
            <Pressable
                onPress={props.onPress}
                style={[styles.container, { zIndex: 100 }, (props.multiline) && { alignItems: 'flex-start' }, props.textContianerStyle]} ref={ref => FormFeildRef.current[0] = ref}>
                {
                    <View>
                        {props.left}
                    </View>

                }
                {
                    (props.onPress)?
                    <View style={styles.viewStyle}>
                        {
                            (props.value=='')?
                            <Text style={styles.placeholderStyle} >{props.placeholder}</Text>
                            :
                            <Text style={styles.valueTextStyle} >{props.value}</Text>
                        }
                    </View>:
                    <TextInput    
                        editable={props.editable}
                        secureTextEntry={showPassword ? false : props.secureTextEntry}
                        placeholder={props.placeholder}
                        style={[styles.input, (props.multiline) && { height: 70, textAlignVertical: 'top' }, props.style]}
                        placeholderTextColor={Colors.placeholder}
                        keyboardType={props.keyboardType}
                        ref={ref => FormFeildRef.current[2] = ref}
                        multiline={(props.multiline) ? props.multiline : false}
                        value={props.value}
                        maxLength={props.maxLength}
                        // value={value}
                        onChangeText={onChange}
                        onBlur={props.onBlur}
                        onEndEditing={props.onEndEditing}

                    />
                }
                {props.right &&
                    <View>
                        {props.right}
                    </View>
                    // <View style={{ position: 'absolute', right: 10 }}>
                    //     <TouchableWithoutFeedback onPress={handleHide}>
                    //         <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color='#9C9C9C' />
                    //     </TouchableWithoutFeedback>
                    // </View>
                }
            </Pressable>
            <Text style={styles.errorText} >{errorMsg ? errorMsg : props.error}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

        borderWidth: 1,
        width: "100%",
        backgroundColor: '#F2F4F7',
        borderColor: '#EAECF0',
        borderRadius: moderateScale(6),
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    input: {
        padding: Platform.OS == 'android' ? 4 : 8,
        maxWidth: '85%',
        flex: 1,
        height: '100%',
        color: Colors.black,
        fontSize: 14,
        fontFamily: Fonts.regular,
        paddingHorizontal: "3%",
        // paddingVertical:Platform.OS == 'ios'?:0

    },
    svgContainer: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    label: {
        fontFamily: Fonts.regular,
        paddingHorizontal: "1%",
        paddingVertical: '4%',
        fontSize: moderateScale(16),
        color: '#808D9E',
    },
    modalContianer: {

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    selectBox: {
        width: "80%",
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16
    },
    selectLabel: {
        color: Colors.primary,
        paddingVertical: 8
    },
    errorText: {
        color: Colors.error,
        paddingHorizontal: 8,
        marginVertical: 6,
        // height: moderateScale(30),
        fontSize: moderateScale(11),
        textTransform: 'capitalize',
    },
    optionBtn: {

        padding: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.placeholder
    },
    optionLabel: {
        textTransform: 'capitalize'
    },
    viewStyle:{
        padding: Platform.OS == 'android' ? 4 : 8,
    },
    valueTextStyle:{
        color: Colors.black,
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    placeholderStyle:{
        color: Colors.placeholder,
        fontSize: 14,
        fontFamily: Fonts.regular,
    }
})

export default TextFeild
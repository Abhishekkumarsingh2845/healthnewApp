import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle, TouchableWithoutFeedback, Pressable } from "react-native";
import { ERROR_COLOR, PRIMARY_COLOR, INPUT_COLOR, TEXT_COLOR } from "../config/colors";
import { SCREEN_WIDTH } from "../config/constants";
import { FormFeildPropsType, Input } from "../models/formModel";
import { ReactNode, useRef, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign"
import { s } from "react-native-wind";
import AppPopup from "./AppPopup";
import { TextFeildPropsType } from "./TextFeild";
import { openGallery } from "@utils/imageHandle";
import DateTimePickerModal from "react-native-modal-datetime-picker";
const DatePicker = (props: TextFeildPropsType) => {
    // console.log("date  = ", props)
    const [open , setOpen] = useState(false);
    const onChange = async (): Promise<void> => {
        if(props.editable){
            setOpen(true)
        }
        
        
    }

    const setDate = (value: Date): void => {
        // console.log('date', value.toDateString())
        if(props.setValue){
            props.setValue(props.name, value.toDateString());
        }
        // // if (props.name == 'dob') {
        //     props.setValue('zodiac', getZoidacByDate(value))
        //     props.setValue('age', getAgeByDate(value))
        // }
        setOpen(false)
    }

    return (
        <>
            
            <DateTimePickerModal
                    // maximumDate={}
                    
                    isVisible={open}
                    mode="date"
                    onConfirm={setDate}
                    onCancel={() => {
                        // console.log('cancel...');
                        setOpen(false)
                    }}
                />

            <View style={{ height: 100, position: 'relative' }}>
                <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>

                <Pressable onPress={onChange} >
                    <View style={[styles.container, (props.multiline) && { alignItems: 'flex-start' }, props.textContianerStyle]} >
                        {

                            <TextInput
                                editable={props.editable}
                                placeholder={props.placeholder}
                                style={[styles.input, (props.multiline) && { height: 70, textAlignVertical: 'top' }, props.style]}
                                placeholderTextColor={INPUT_COLOR}
                                keyboardType={props.keyboardType}
                                // ref={ref => FormFeildRef.current[2] = ref}
                                multiline={(props.multiline) ? props.multiline : false}
                                value={props.value && new Date(props.value).toLocaleDateString()}
                                onFocus={onChange}
                                onChangeText={onChange}
                            />
                        }

                    </View>
                </Pressable>

                <Text style={styles.errorText} >{props.error}</Text>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {

        borderWidth: 1,
        width: "100%",
        // backgroundColor:'black',
        borderColor: INPUT_COLOR,
        borderRadius: SCREEN_WIDTH * 0.03,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    input: {
        padding: 0,
        width: '85%',
        height: '100%',
        fontSize: 14,
        fontWeight: '400',
        paddingHorizontal: "3%"

    },
    svgContainer: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    label: {
        paddingHorizontal: "3%",
        paddingVertical: '2%',
        fontSize: 16,
        color: TEXT_COLOR
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
        color: PRIMARY_COLOR,
        paddingVertical: 8
    },
    errorText: {
        color: ERROR_COLOR,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12,
        // marginBottom: "1%",
    },
    optionBtn: {

        padding: 8,
        borderTopWidth: 1,
        borderTopColor: INPUT_COLOR
    },
    optionLabel: {
        textTransform: 'capitalize'
    }
})
export default DatePicker;
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle, TouchableWithoutFeedback, Pressable, useColorScheme, ScrollView } from "react-native";


import { ReactNode, useRef, useEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

import AppPopup from "./AppPopup";
import { moderateScale } from "react-native-size-matters";
import { FontStyle } from "../config/style.config";
import { Size } from "../config/size.config";
import { Colors } from "../config/colors.config";
import { Fonts } from "../config/font.config";


export interface SelectInputPropsType extends TextInputProps {
    error: any,
    setValue?: (name: string, value: any) => any,
    left: ReactNode,
    editable: boolean,
    label: string,
    name: string,
    multiline?: boolean,
    type?: string
    labelStyle?: TextStyle,
    textInputStyle?: TextStyle,
    textContianerStyle?: ViewStyle,
    right?: boolean,
    options?: Array<string>,
    todaDetails?: any,
    getTownData?: any,
    getBarangayData?: any,
    getTodaNumber?: any,
    todaNumber?: any

}
const SelectInput = (props: SelectInputPropsType) => {
    const [open, setOpen] = useState(false);
    const colorScheme = useColorScheme();
    const onChange = (value: string): void => {
        {/* // @ts-ignore */}
        if (props.setValue) {
            props.setValue(props.name, value);
        }
    }
    const handleOpen = () => {
        props.editable && setOpen(true)
    }

    return (
        <>
            <AppPopup

                visable={open} setVisable={setOpen} children={
                    <>
                        <Text style={[FontStyle.titleSemibold, { padding: moderateScale(12), textAlign: 'center', }]}>Select Options</Text>
                        <View style={[{ maxHeight: Size.screenWidth * 0.5, padding: moderateScale(8) }]}>
                            <ScrollView showsVerticalScrollIndicator={false}>

                                {
                                    (props.options?.length! > 0) ?
                                        <>
                                            {
                                                props.options?.map((item, index) => {
                                                    return (
                                                        <Pressable
                                                            style={{
                                                                borderBottomWidth: 1,
                                                                borderBottomColor: Colors.borderColor,
                                                            }}
                                                            key={item} onPress={() => {
                                                                onChange(item)
                                                                setOpen(false)
                                                            }}>
                                                            <Text style={[

                                                                {
                                                                    paddingHorizontal: moderateScale(8),
                                                                    paddingVertical: moderateScale(8),
                                                                    color: Colors.black,
                                                                    textTransform: 'capitalize'
                                                                }
                                                            ]} >{item} </Text>
                                                        </Pressable>
                                                    )

                                                })
                                            }
                                        </>

                                        : <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: moderateScale(4) }} >
                                            <Text style={[FontStyle.regular, { color: Colors.bgInput }]} >No Records found</Text>
                                        </View>
                                }
                            </ScrollView>


                        </View>
                    </>

                } icon={<></>} title={props.label}
            />
            <View style={{ position: 'relative' }}>
                <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>

                <Pressable onPress={handleOpen} >
                    <View style={[styles.container, (props.multiline) && { alignItems: 'flex-start' }, props.textContianerStyle]} >
                        {

                            <TextInput
                                editable={false}
                                placeholder={props.placeholder}
                                style={[styles.input, (props.multiline) && { height: 70, textAlignVertical: 'top' }, props.style]}
                                placeholderTextColor={'#8F8F8F'}
                                keyboardType={props.keyboardType}

                                // ref={ref => FormFeildRef.current[2] = ref}
                                multiline={(props.multiline) ? props.multiline : false}
                                value={props.value}
                                onChangeText={onChange}
                                onFocus={handleOpen}
                            />
                        }



                        <View style={{ position: 'absolute', right: 10 }}>
                            <AntDesign name={'caretdown'} size={moderateScale(11)} color='black' />
                        </View>

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
        padding: 0,
        width: '85%',
        height: '100%',
        fontSize: 14,
        fontWeight: '400',
        paddingHorizontal: "3%",
        color: Colors.black,
        textTransform: 'capitalize'

    },
    svgContainer: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    label: {
        fontFamily: Fonts.medium,
        fontSize: moderateScale(14),
        paddingHorizontal: "3%",
        paddingVertical: '2%',


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
        paddingVertical: 4,
        fontSize: 11,
        textTransform: 'uppercase'
        // marginBottom: "1%",
    },
    optionBtn: {
        textTransform: 'uppercase',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor
    },
    optionLabel: {
        textTransform: 'capitalize'
    }
})
export default SelectInput;
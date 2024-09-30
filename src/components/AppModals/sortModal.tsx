
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppBottomSheet, { AppBottomSheetPropType } from "../AppBottomSheet";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from "react-native-size-matters";
import { FontStyle, Style } from "../../config/style.config";
import { Fonts } from "../../config/font.config";
import { Colors } from "../../config/colors.config";
import CheckBox from "../CheckBox";
import {  useCallback, useState } from "react";
import Octicons from 'react-native-vector-icons/Octicons'

const SortOptions =[
        {
            title: 'Price Low to High',
            value: 1
        },
        {
            title: 'Price High to Low',
            value: 2
        },
        {
            title: 'Rating Low to High',
            value: 3
        },
        {
            title: 'Rating High to Low',
            value: 4
        },
    ];




interface SortModalPropType extends AppBottomSheetPropType {
    onSort:(value:number)=>void
}
const SortingModal = (props: SortModalPropType) => {
    const [selectedValue, setSelectedValue] = useState(0);
    const sortFun = useCallback((value:number)=>{
        setSelectedValue(value);
        props.onSort(value);
        props.setModalVisible(false);

    },[])
    // console.log(selectedValue, 'Values')
    return (
        <>
            <AppBottomSheet  {...props}
                modalContainerStyle={style.modalContainerStyle}
            >
                <View style={style.crossbox}>
                    <Pressable style={style.cross}
                        onPress={() => {
                            setSelectedValue(0);
                            props.setModalVisible(false);
                        }}
                    >
                        <AntDesign name={'close'} size={moderateScale(16)} />
                    </Pressable>
                </View>
                <ScrollView className=" w-full">

                    <View className=" w-100" style={[Style.flexOne, Style.fullWidth, { padding: moderateScale(12) }]}>
                        {/* Filter Header */}
                        <View style={[Style.flexRow, { justifyContent: 'space-between' }]} >
                            <View style={[Style.flexRow, { gap: moderateScale(4) }]}>
                                <Octicons name={'sort-desc'} size={moderateScale(20)} />
                                <Text style={style.title} >Sort</Text>
                            </View>

                        </View>
                        <View style={style.sortBox} >
                            <Text style={style.title} >Sort</Text>
                            <View style={{ paddingTop: moderateScale(10), gap: moderateScale(10) }} >

                                {
                                    SortOptions.map((item, index) => {
                                        return (

                                            <Pressable
                                            onPress={()=>sortFun(item.value)}
                                            className="items-center" key={index} style={[Style.flexRow]} >
                                                <CheckBox
                                                    intialValue={item.value == selectedValue}
                                                    checkboxStyle={style.checkbox}
                                                    notCheckedBg={Colors.white}
                                                    // onValueChange={()=>setSelectedValue(item.value)}
                                                />
                                                <Text style={[style.text]} >{item.title}</Text>
                                            </Pressable>
                                        )
                                    })
                                }
                            </View>

                        </View>

                    </View>
                </ScrollView>
            </AppBottomSheet>
        </>
    )
}

interface FilterPropType {
    options: Array<string>,
    title: string,
}
const Filter = (props: FilterPropType) => {
    const [value, setValue] = useState('');

    return (<>
        <View style={{ paddingTop: moderateScale(12) }}>
            <Text style={style.title} >{props.title}</Text>
            <View style={[Style.flexRow, { gap: moderateScale(10), paddingTop: moderateScale(8) }]} >
                {
                    props.options.map((item) => {
                        return (
                            <Pressable onPress={(() => {
                                setValue(item);
                            })} key={item} style={[style.boxBtn, (value == item) && style.activeBoxBtn]} >
                                <Text style={[style.text, (value == item) && style.activeText]} >{item}</Text>
                            </Pressable>
                        )
                    })
                }

            </View>
        </View>
    </>)
}


const style = StyleSheet.create({
    modalContainerStyle: {
        padding: 0,
        paddingHorizontal: moderateScale(20),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    crossbox: {
        position: 'absolute',
        top: -45,
    },
    cross: {
        borderRadius: 100,
        backgroundColor: Colors.white,
        padding: moderateScale(6)
    },
    title: {
        ...FontStyle.titleSemibold,
        fontSize: moderateScale(14),
        paddingBottom: moderateScale(4)
    },
    text: {
        ...FontStyle.regular,
        fontSize: moderateScale(14),
        color: '#808D9E',
        paddingHorizontal: moderateScale(4)
    },
    activeText: {
        color: Colors.black,
        fontFamily: Fonts.semibold
    },
    checkbox: {
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#707784'
    },
    sortBox: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
        marginVertical: moderateScale(10),
        paddingTop: moderateScale(10)
    },
    boxBtn: { backgroundColor: '#F2F4F7', paddingVertical: moderateScale(8), paddingHorizontal: moderateScale(10), borderRadius: moderateScale(8), },
    activeBoxBtn: { backgroundColor: '#FFF212', }

})


export default SortingModal;
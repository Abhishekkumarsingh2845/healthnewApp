import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Size } from "../../config/size.config";
import { Colors } from "../../config/colors.config";
import AppBottomSheet from "../AppBottomSheet";
import { FontStyle, Style } from "../../config/style.config";
import AppButton from "../AppButton";
import { moderateScale } from "react-native-size-matters";
import SearchBar from "../SearchBar";
import Icons from 'react-native-vector-icons/AntDesign'
import CheckBox from "../CheckBox";
import { AppBlurModalPropType } from "../AppBlurModal";

interface FilterModalPropType extends AppBlurModalPropType{

}
const intailFilterOptions = [
    {
        title: "Categories",
        isApplied: true
    },
    {
        title: "Sort By",
        isApplied: false
    },
    {
        title: "Date",
        isApplied: false
    },
]
const FilterModal = (props:FilterModalPropType) => {
    const [filterOptions, setFilterOptions] = useState(intailFilterOptions)
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <>

            <AppBottomSheet modalVisible={props.modalOpenFlag} setModalVisible={props.modalClose}>
                <View>
                    <View style={[Style.flexRow, { justifyContent: 'space-between', width: '100%', marginBottom: moderateScale(10) }]}>

                        <Text style={[FontStyle.bold, { color: Colors.black }]} >Filter(3)</Text>

                        <Text style={[FontStyle.regular, { color: Colors.black }]}  >Clear All</Text>
                    </View>


                    <View style={[Style.flexRow,]}>
                        <View style={{
                            width: '35%',
                            height: '100%',
                            borderRightWidth: 1,
                            borderColor: Colors.borderColor,
                            paddingRight: moderateScale(15)
                        }}>
                            {
                                filterOptions.map((item,index) => {
                                    return (
                                        <Pressable
                                        onPress={()=>{
                                            setSelectedIndex(index)
                                        }}
                                        key={`filter-${index}`} style={[styles.btn,(!item.isApplied)&&categorStyle.unselectedBtn]}>
                                            <Text style={[styles.text,(!item.isApplied)&&{color:Colors.primary}]}>{item.title}</Text>
                                        </Pressable>
                                    )
                                })
                            }
                            
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                paddingHorizontal: moderateScale(4)
                            }}
                        >
                            {
                                (selectedIndex == 0)&&
                                <Categories/>
                            }
                            {
                                (selectedIndex == 1)&&
                                <SortBy/>
                            }
                            {
                                (selectedIndex == 2)&&
                                <Date/>
                            }                            

                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: moderateScale(10) }}>
                    <AppButton label={"Cancel"}  textStyle={styles.textPrimary} btnstyle={{ ...styles.actionBtn, ...styles.borderedActionBtn }} loading={false} onClick={() => {
                        props.modalClose(false);
                     }} />
                    <AppButton label={"Apply Filter"} btnstyle={styles.actionBtn} loading={false} onClick={() => {
                        props.modalClose(false);
                     }} />
                </View>
            </AppBottomSheet>

        </>
    )
}


const Categories = () => {
    return (
        <View>
            <View style={categorStyle.container}>
                <Text style={[FontStyle.bold, { color: Colors.black }]}>Categories</Text>

                <Text style={[FontStyle.regular, { color: Colors.black }]}>Select the category which you want to see.</Text>

                <View style={{ flexDirection: 'row', }}>
                    <Pressable style={[
                        Style.flexRow,
                        categorStyle.selectBtn
                    ]}>
                        <Text>Health News</Text>
                        <Icons name="close" size={moderateScale(12)} />
                    </Pressable>
                </View>

                <SearchBar
                    placholder={"Search"}
                    label={""}
                    type={"input"}
                    containerStyle={categorStyle.search}
                />

                <View style={{ padding: moderateScale(10), width: '100%' }}>
                    <View style={[Style.flexRow, categorStyle.checkboxContainer]}>
                        <CheckBox  checkedBg={Colors.black} />
                        <Text>Select All (120)</Text>
                    </View>
                    <View style={{ marginLeft: moderateScale(10) }}>
                        {
                            new Array(5).fill('').map(() => {
                                return (<>
                                    <View style={[Style.flexRow, {
                                        paddingVertical: moderateScale(10)
                                    }]}>
                                        <CheckBox checkedBg={Colors.black} />
                                        <Text>Health News</Text>
                                    </View>
                                </>)
                            })
                        }

                    </View>
                </View>
            </View>

        </View>
    )
}
const SortBy = () => {
    return (
        <View>
            <View style={categorStyle.container}>
                <Text style={[FontStyle.bold, { color: Colors.black }]}>Sort By</Text>

                <Text style={[FontStyle.regular, { color: Colors.black }]}>Select the sorting which you want to see.</Text>



                <View style={{ padding: moderateScale(10), width: '100%' }}>
                    <View style={{ marginLeft: moderateScale(4), minHeight: Size.screenHeight * 0.25 }}>
                        {
                            ["Relevance", 'Popularity', 'Latest'].map((item, index) => {
                                return (
                                    <View key={`sort-${index}`} style={[Style.flexRow, {
                                        paddingVertical: moderateScale(10)
                                    }]}>
                                        <View style={
                                            sortStyle.radioBtn
                                        }>
                                            <View style={{ backgroundColor: Colors.black, flex: 1, borderRadius: moderateScale(20) }} />
                                        </View>
                                        <Text>{item}</Text>

                                    </View>
                                )
                            })
                        }

                    </View>
                </View>
            </View>

        </View>
    )
}
const Date = () => {
    return (
        <View>
            <View style={categorStyle.container}>
                <Text style={[FontStyle.bold, { color: Colors.black }]}>Date wise</Text>

                <Text style={[FontStyle.regular, { color: Colors.black }]}>Select the date which you want to see.</Text>

                <Text style={[FontStyle.titleSemibold, { color: Colors.black, fontSize: moderateScale(16) }]}>Date Range</Text>

                <View style={{ padding: moderateScale(10), width: '100%' }}>
                    <View style={{ marginLeft: moderateScale(4), minHeight: Size.screenHeight * 0.25 }}>
                        {
                            ["From", 'To',].map((item, index) => {
                                return (
                                    <View key={`sort-${index}`} style={[Style.flexRow, {
                                        paddingVertical: moderateScale(10),
                                        flexWrap: 'nowrap',
                                        justifyContent:'space-between'
                                    }]}>
                                        <Text>{item}: </Text>
                                        <View style={[Style.flexRow,
                                        dateStyle.dateFeild
                                        ]}>
                                            <Text>dd/mm/yyyy</Text>
                                            <Icons name={'calendar'} color={Colors.gray} size={moderateScale(16)} />
                                        </View>
                                    </View>
                                )
                            })
                        }

                    </View>
                </View>
            </View>

        </View>
    )
}


const categorStyle = StyleSheet.create({
    container: { paddingHorizontal: moderateScale(4), gap: moderateScale(10) },
    selectBtn: {

        gap: moderateScale(3),
        minWidth: moderateScale(100),
        backgroundColor: Colors.borderColor,
        padding: moderateScale(6),
        borderRadius: moderateScale(4)

    },
    unselectedBtn:{
        backgroundColor:Colors.white,
        borderWidth: 1,
        borderColor:Colors.primary

    },
    search: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: moderateScale(12),
        width: '100%'
    },
    checkboxContainer: {
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
        paddingVertical: moderateScale(10)
    },

})

const sortStyle = StyleSheet.create({
    radioBtn: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(100),
        borderColor: Colors.black,
        borderWidth: 1,
        overflow: 'hidden',
        padding: moderateScale(3),
        marginRight: moderateScale(5)
    }
})

const dateStyle = StyleSheet.create({
    dateFeild: {
        gap: moderateScale(4),
        borderWidth: 1,
        borderColor: Colors.gray,
        padding: moderateScale(8),
        borderRadius: moderateScale(8),
        marginLeft: moderateScale(6)
    }
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        position: 'absolute'
    },
    contentContainer: {

    },
    inActiveBtn: {

    },
    btn: {
        backgroundColor: Colors.primary,
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(5),
        alignItems: 'center',
        marginTop: moderateScale(10),
        borderRadius: moderateScale(8)
    },
    text: {
        color: Colors.white
    },
    actionBtn: {
        width: '45%',
        borderRadius: moderateScale(10)
    },
    borderedActionBtn: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary
    },
    textPrimary: {
        color: Colors.primary
    }
});

export default FilterModal;
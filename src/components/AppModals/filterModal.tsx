
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppBottomSheet, { AppBottomSheetPropType } from "../AppBottomSheet";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale } from "react-native-size-matters";
import { FontStyle, Style } from "../../config/style.config";
import { Fonts } from "../../config/font.config";
import { Size } from "../../config/size.config";
import { Colors } from "../../config/colors.config";
import { SVG } from "../../generated/image.assets";
import CheckBox from "../CheckBox";
import { ReactNode, useCallback, useState } from "react";
import RangeSlider from 'rn-range-slider';
import AppRangeSlider, { SliderRangePropType } from "../AppRangeSlider";
import AppButton from "../AppButton";


const SortOptions = [
    'Price Low to High',
    'Price High to Low',
    'Rating Low to High',
    'Rating High to Low',
];
const Skills = [
    'Tarot',
    'Vedic',
    'Face Reading'
]
const Gender = [
    'Male',
    'Female',
    'Other'
]
const Langs = [
    'English',
    'Hindi',
    'Bhojpuri',
    'Gujrati',
    'Marathi',
    'Malyalam',
    'Kannad',
    'Punjabi'
]

const style = StyleSheet.create({
    modalContainerStyle: {
        padding: 0,
        paddingHorizontal: moderateScale(20),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: Size.screenHeight * 0.65
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

interface FilterModalPropType extends AppBottomSheetPropType {
    onClose: () => void
}
const FilterModal = (props: FilterModalPropType) => {
    const [experience, setExperience] = useState({ low: 1, high: 35 })
    const [price, setPrice] = useState({ low: 1, high: 1 })
    return (
        <>
            <AppBottomSheet  {...props}
                modalContainerStyle={style.modalContainerStyle}
            >
                <View style={style.crossbox}>
                    <Pressable style={style.cross}
                        onPress={() => {
                            props.onClose();
                        }}
                    >
                        <AntDesign name={'close'} size={moderateScale(16)} />
                    </Pressable>
                </View>


                <View style={[Style.flexOne, Style.fullWidth, { padding: moderateScale(12) }]}>
                    {/* Filter Header */}
                    <View style={[Style.flexRow, { justifyContent: 'space-between' }]} >
                        <View style={[Style.flexRow, { gap: 4 }]}>
                            <SVG.ic_filter_2 width={moderateScale(20)} />
                            <Text style={style.title} >Filter</Text>
                        </View>
                        <Pressable>
                            <Text style={style.title} >Clear All</Text>
                        </Pressable>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={style.sortBox} >
                            <Text style={style.title} >Sort</Text>
                            <View style={{ paddingTop: moderateScale(10), gap: moderateScale(10) }} >

                                {
                                    SortOptions.map((item, index) => {
                                        return (

                                            <View key={index} style={[Style.flexRow]} >
                                                <CheckBox checkboxStyle={style.checkbox}
                                                    notCheckedBg={Colors.white}
                                                />
                                                <Text style={[style.text]} >{item}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <Filter
                                title={'Select Skill'}
                                options={Skills}
                            />
                            <Filter
                                title={'Select language'}
                                options={Langs}
                            />

                            <SliderFilter title={"Experience"}
                                max={35}
                                min={1}
                                step={1}
                                label="Years"
                            />
                            <SliderFilter title={"Price"}
                                max={50}
                                min={5}
                                step={5}
                                label="Mins"
                                onChangeValue={(min,max)=>{
                                    setPrice({low:min,high:max})
                                    // console.log(min, max, 'change')
                                }}
                                RenderNotchLabel={({name})=>{
                                    return(
                                        <Text style={[FontStyle.titleSemibold, { fontSize: moderateScale(12), textAlign:(name=="low")?'left':'right'  }]} >Rs. {(name=="low")?price.low:price.high}/min</Text>
                                    )
                                }}
                            />

                            <Filter
                                title={'Select Gender'}
                                options={Gender}
                            />
                            <AppButton label={'Apply'} btnstyle={{
                                paddingVertical: moderateScale(0),
                                minHeight: moderateScale(40),
                                borderRadius: moderateScale(12),
                                marginTop: moderateScale(20),
                                marginBottom: moderateScale(10)
                            }} loading={false} onClick={() => { }} />
                        </View>

                    </ScrollView>
                </View>
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
interface SliderFilterPropType extends SliderRangePropType {
    title: string,

}
const SliderFilter = (props: SliderFilterPropType) => {

    const [value, setValue] = useState('');

    return (<>
        <View style={{ paddingTop: moderateScale(12) }}>
            <Text style={style.title} >{props.title}</Text>
            <View>
                <AppRangeSlider
                    {
                    ...props
                    }
                />
            </View>
        </View>
    </>)
}



export default FilterModal;
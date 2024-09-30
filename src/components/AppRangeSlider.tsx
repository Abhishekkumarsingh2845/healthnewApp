import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import RnRangeSlider from 'rn-range-slider';
import { Colors } from '../config/colors.config';
import { moderateScale } from 'react-native-size-matters';
import { Fonts } from '../config/font.config';
import { FontStyle } from '../config/style.config';
interface ThumbType {
    name: 'high' | 'low',
}




const Rail = () => <View style={[styles.rail,]} />;
const RailSelected = () => <View style={[styles.railSelected,]} />;



export interface SliderRangePropType {
    min: number,
    max: number,
    step: number,
    label: string,
    onChangeValue?: (min: number, max: number) => void,
    RenderNotchLabel?: (props:ThumbType) => JSX.Element
}
const SliderRange = ({ min, max, step, label, onChangeValue, RenderNotchLabel }: SliderRangePropType) => {
    const [low, setLow] = useState(min);
    const [high, setHigh] = useState(max);

    // ***********Slide********

    const Thumb = ({ name }: ThumbType) => {

        const value = useMemo(() => {
            return (name == 'high') ? high : low;
        }, [name])
        return (
            <View style={{ position: 'relative', alignItems: (name=='low')?'flex-start': 'flex-end' }}>

                <View style={styles.thumb} />
                <View style={styles.valueStyle} >
                    {
                        (RenderNotchLabel) ?
                            <RenderNotchLabel name={name} /> :
                            <Text style={[FontStyle.titleSemibold, { fontSize: moderateScale(12), textAlign: (name=='low')?'left':'right' }]} >{value} {label}</Text>
                    }
                </View>
            </View>


        )
    };

    // const renderThumb = useCallback((name: any) => <Thumb name={name}/>, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    // const renderLabel = useCallback(value => <Label text={"hello"} />, []);
    const handleValueChange = useCallback((L: number, H: number) => {
        // console.log(L, H)
        setLow(L);
        setHigh(H);
        if (onChangeValue) {
            onChangeValue(L, H);
        }
    }, []);


    return (
        <RnRangeSlider
            style={styles.slider}
            min={min}
            max={max}
            step={step}
            floatingLabel={true}
            renderThumb={(name) => {
                return (
                    <Thumb name={name} />
                )

            }}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            onValueChanged={handleValueChange}
        />
    )
}

export default SliderRange

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    slider: {
        width: "100%",
        paddingTop: moderateScale(5),
        paddingHorizontal: '2%',
        paddingBottom: moderateScale(30),
        alignSelf: 'center',

    },
    thumb: {
        width: moderateScale(15),
        height: moderateScale(15),
        backgroundColor: Colors.primary,
        borderRadius: moderateScale(15),
        position: 'relative',
        zIndex: 20
    },
    valueStyle: {
        position: 'absolute',
        minWidth: moderateScale(100),
        maxWidth: moderateScale(100),
        top: moderateScale(15),
        marginTop: moderateScale(2),
    },
    rail: {
        flex: 1,
        height: moderateScale(3),
        backgroundColor: '#EAECF0',
        borderRadius: 2.5,
    },
    railSelected: {
        height: moderateScale(3),
        backgroundColor: '#FFF212',
        borderRadius: 2.5,
    },
    notch: {
        width: 5,
        height: 5,
        backgroundColor: 'gray',
        borderRadius: 2.5,
    },
    label: {
        textAlign: 'center',
        color: 'blue',
    },
})
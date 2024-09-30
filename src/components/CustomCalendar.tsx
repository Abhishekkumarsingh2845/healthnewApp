
import { memo, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { s } from 'react-native-wind';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { PRIMARY_COLOR } from '../config/colors';
import { Font } from '../config/typography';
import { FAMILY } from '../../src/config/constants';
import { formatDate } from '../utils/dobFun';
const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
interface CustomCalendarPropType {
    onSelect: (data: any) => void,
    minDate?: string,
    maxDate?: string
}
const CustomCalendar = ({ onSelect, minDate, maxDate }: CustomCalendarPropType) => {
    const INITIAL_DATE = new Date().toDateString();
    const [selected, setSelected] = useState(INITIAL_DATE);
    const onDayPress = (day: any) => {
        // console.log(day);
        setSelected(day.dateString);
        onSelect(day.dateString);
    }
    useEffect(() => {
        const date = new Date();
        // console.log(date.toLocaleDateString(),'local date')
        // console.log(formatDate(date.toLocaleDateString('en',{ year: 'numeric', month: 'numeric', day: 'numeric' })), 'date..');
        setSelected(formatDate(date.toLocaleDateString('en', dateOptions)));
        // console.log(formatDate(date.toLocaleDateString('en', dateOptions)), 'selected Date.....');
        onSelect(formatDate(date.toLocaleDateString('en', dateOptions)));
    }
        , [])
    useEffect(() => {
        // console.log(selected, 'selected date...')
    }, [selected])
    return (
        <>
            <Calendar
                onDayPress={onDayPress}
                current={selected}
                // key={selected}
                initialDate={selected}
                minDate={minDate}
                maxDate={maxDate}
                theme={{
                    todayTextColor: PRIMARY_COLOR,
                    textDayFontFamily: FAMILY.regular,
                    // todayButtonFontFamily:FAMILY.semibold,
                    selectedDayBackgroundColor: PRIMARY_COLOR,
                    textDayFontSize: 14,
                    // textDayHeaderFontWeight: '600', 
                    dayTextColor: 'rgba(158, 158, 158, 1)',

                }}



                enableSwipeMonths={true}
                hideDayNames={false}
                style={calendarsStyles.container}
                customHeader={() => <Header date={selected} setDate={setSelected} />}
                markedDates={{
                    [selected]: { selected: true, }
                }}
            />
        </>
    )
}

const Header = (props: { date: any, setDate: (data: any) => any }) => {
    const getMonth = () => {
        const date = new Date(props.date);
        // console.log(props.date, 'date')
        const month = date.toLocaleString('default', { month: 'long' });
        // console.log(month);
        return month;
    }
    const prevMonth = () => {
        // console.log(props.date);

        const resultDate = new Date(props.date);
        resultDate.setMonth(resultDate.getMonth() - 1);
        resultDate.setDate(1);
        props.setDate(new Date(resultDate));

    }
    const nextMonth = () => {
        // console.log(props.date);
        const resultDate = new Date(props.date);
        resultDate.setDate(1);
        resultDate.setMonth(resultDate.getMonth() + 1);
        resultDate.setDate(1);
        // console.log(new Date(resultDate), 'change month..')
        props.setDate(new Date(resultDate));

    }
    return (
        <View>

            <View style={headerStyle.container}>
                <Text style={headerStyle.title} >{`${getMonth()}  ${new Date(props.date).getUTCFullYear()} `}</Text>
                <View style={s`flex-row items-center`}>
                    <TouchableOpacity style={s`px-1 mx-1`} onPress={prevMonth}>
                        <AntDesign name='arrowleft'
                            color={PRIMARY_COLOR}
                            size={17}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={s`px-1 mx-1`} onPress={nextMonth}>
                        <AntDesign name='arrowright'
                            color={PRIMARY_COLOR}
                            size={17}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[headerStyle.container, { paddingHorizontal: 14, paddingVertical: 10, justifyContent: 'space-between' }]}>
                {
                    ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa',].map((item) => {
                        return (
                            <Text key={item} style={{ ...Font.body, textTransform: 'capitalize', fontFamily: FAMILY.semibold }} >{item}</Text>
                        )
                    })
                }
            </View>
        </View>
    )
}
const headerStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    title: {
        ...Font.title,
        fontFamily: FAMILY.semibold
    }
});
const calendarsStyles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        padding: 12
    },
    dayNames: {
        color: 'blue',
    },
});

export default memo(CustomCalendar);
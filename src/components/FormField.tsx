import { KeyboardTypeOptions, Pressable, StyleSheet, TextInput, View, TouchableOpacity, ScrollView } from "react-native"
import { ERROR_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from "../config/colors"
import { SCREEN_WIDTH } from "../config/constants"
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { memo, useRef, useState } from "react";
import Com from '../assets/svg/icon.svg';
import { FormFeildPropsType, Input } from "../models/formModel"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Modal, Portal, Text } from "react-native-paper"
import { getAgeByDate, getZoidacByDate } from "../utils/dobFun"

interface FormFeildProps extends FormFeildPropsType {
    error: any,
    setValue: (name: string, value: string | number) => any
}
const FormFeild = (props: FormFeildProps) => {
    const FormFeildRef = useRef<Array<any>>([]);
    const [visableDate, setVisableDate] = useState(false);
    const [visableModal, setVisableModal] = useState(false);
    const maximumDate = new Date().setFullYear(new Date().getFullYear() - 12);




    // FUNCTIONS.......

    const onChange = (value: string): void => {
        props.setValue(props.name, value);
        // console.log(props.error, 'error')
        if (props.error) {
            if (props.error.length > 0) {
                changeColor(ERROR_COLOR, 'error');
            } else {
                changeColor('black', 'focus')
            }
        } else {
            changeColor('black', 'focus')
        }
    }




    const setDate = (value: Date): void => {
        props.setValue(props.name, value.toString());
        if (props.name == 'dob') {
            props.setValue('zodiac', getZoidacByDate(value))
            props.setValue('age', getAgeByDate(value))
        }
        setVisableDate(false)
    }





    const changeColor = (color: string, state: string) => {
        if (['focus', 'blur', 'date'].includes(state)) {
            FormFeildRef.current[0].setNativeProps({ borderColor: color });
            if (state == 'date') {
                FormFeildRef.current[4].setNativeProps({ style: { color: color } });
            }
        }
        else {
            FormFeildRef.current[0].setNativeProps({ borderColor: color });
        }
    }





    // RENDER....
    return (

        <>
            {(props.type == "date") &&

                <DateTimePickerModal
                    maximumDate={(props.name == 'dob') ? new Date(maximumDate) : new Date()}
                    isVisible={visableDate}
                    mode="date"
                    onConfirm={setDate}
                    onCancel={() => {
                        // console.log('cancel...');
                        setVisableDate(false)
                    }}
                />

            }
            {
                (props.type == "select") &&
                <>
                    <Portal>
                        <Modal style={styles.modalContianer} visible={visableModal} onDismiss={() => { setVisableModal(false) }} contentContainerStyle={styles.selectBox}  >

                            <Text variant={'titleLarge'} children={props.placeHolder} style={styles.selectLabel} />
                            <ScrollView showsVerticalScrollIndicator={false}>

                                {
                                    props.options?.map((item) => {
                                        return (
                                            <TouchableOpacity style={styles.optionBtn} key={item.title} onPress={() => {
                                                setVisableModal(false);
                                                props.setValue(props.name, item.value)
                                            }} >
                                                <Text variant={'titleMedium'} children={item.title} style={styles.optionLabel} />
                                            </TouchableOpacity>

                                        )
                                    })
                                }
                            </ScrollView>

                        </Modal>
                    </Portal>
                </>
            }


            <View style={[styles.container, (props.multiline) && { alignItems: 'flex-start' }]} ref={ref => FormFeildRef.current[0] = ref}>
                {
                    (props.icon.type == "feather") ?
                        <FeatherIcon
                            name={props.icon.name}
                            size={20}
                            color={SECONDARY_COLOR}
                            style={{ marginRight: 8 }}
                            ref={ref => FormFeildRef.current[1] = ref}
                        /> :
                        <View style={styles.svgContainer}>
                            {
                                props.icon.svg
                            }

                        </View>


                }
                {
                    (props.type == "date") ?
                        <>
                            <TouchableOpacity style={{ width: '85%' }}
                                activeOpacity={0.2}
                                onPress={() => {
                                    // changeColor('black', 'date')
                                    setVisableDate(true);
                                }}
                            >
                                <Text variant={'bodyMedium'} children={(props.value.length > 0) ? `${new Date(props.value).toLocaleDateString()} (${props.label})` : props.placeHolder}
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '300',
                                        color: SECONDARY_COLOR
                                    }} />
                            </TouchableOpacity>
                        </>
                        : (props.type == "select") ?
                            <TouchableOpacity style={{ width: '85%' }}
                                activeOpacity={0.2}
                                onPress={() => {
                                    // changeColor('black', 'date')
                                    setVisableModal(true);
                                }}
                            >
                                <Text variant={'bodyMedium'} children={(props.value.length > 0) ? ` ${props.value} (${props.name})` : props.placeHolder}
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '300',
                                        textTransform: 'capitalize',
                                        color: SECONDARY_COLOR
                                    }} />
                            </TouchableOpacity>
                            :
                            <TextInput
                                editable={props.editable}
                                placeholder={props.placeHolder}
                                style={[styles.input, (props.multiline) && { height: 100, textAlignVertical: 'top' }]}
                                placeholderTextColor={SECONDARY_COLOR}
                                keyboardType={props.keyboardType}
                                ref={ref => FormFeildRef.current[2] = ref}
                                multiline={(props.multiline) ? props.multiline : false}

                                value={props.value.toString()}
                                onChangeText={onChange}
                                onFocus={() => {
                                    changeColor('black', 'focus')
                                }}
                                onBlur={() => {
                                    changeColor(SECONDARY_COLOR, 'blur')
                                }}
                            />
                }

                {
                    (props.editable) &&
                    (!props.multiline) &&
                    <MaterialIcons
                        name={'edit'}
                        size={20}
                        color={SECONDARY_COLOR}
                        ref={ref => FormFeildRef.current[3] = ref}
                    />

                }
            </View>
        </>
    )
}







const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        borderWidth: 1,
        width: "100%",
        // backgroundColor:'black',
        borderColor: SECONDARY_COLOR,
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
        fontWeight: '400'

    },
    svgContainer: {
        width: 20,
        height: 20,
        marginRight: 8
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
    optionBtn: {

        padding: 8,
        borderTopWidth: 1,
        borderTopColor: SECONDARY_COLOR
    },
    optionLabel: {
        textTransform:'capitalize'
    }
})
export default memo(FormFeild);
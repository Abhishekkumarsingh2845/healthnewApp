import { FlatList, Pressable, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import SelectInput from "../../components/SelectInput";
import { StyleSheet } from "react-native";
import CustomCalendar from "../../components/CustomCalendar";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5'
import AppButton from "../../components/AppButton";
import TextFeild from "../../components/TextFeild";
import SearchBar from "../../components/SearchBar";

import { useEffect, useMemo, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/MainNavigation/models";
import { FontStyle } from "../../config/style.config";
import { debounce } from "../../utils/debounce";
import { ServiceResponse } from "../../utils/interfaces";
import { showToastMessage } from "../../utils/toast";
import AppBottomBar from "../../components/AppBottomBar";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "../../config/colors.config";
import { Spacing } from "../../config/size.config";
import AppImage from "../../components/AppImage";
import { Icons } from "../../generated/image.assets";
import BackButton from "../../components/BackButton";

export interface SearchPropType extends StackScreenProps<RootStackParamList, 'Search'> {
    onSelect?: (data: any) => void
}
interface OptionSelectType {
    name: string,
    value: string
}
const TestList: Array<OptionSelectType> = [
    {
        name: 'Test 1',
        value: 'test 1',
    },
    {
        name: 'Test 2',
        value: 'test 2',
    },
    {
        name: 'Test 3',
        value: 'test 3',
    },
]

const Search = (props: SearchPropType) => {
    const Nav = useNavigation();
    const [Places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState<{ index?: number, place?: any }>({})
    
    return (<>
        <AppSafeAreaView containerStyle={{ paddingHorizontal: 0 }}
        >
            <View style={[{ paddingHorizontal: 12, paddingTop:Spacing.topSpace }]}>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent:'space-between'
                }}>
                    <BackButton style={{marginLeft:moderateScale(12), position:'relative'}}  color={Colors.black} size={moderateScale(20)} />
                    <SearchBar
                        placholder={"Search"}
                        label={"Search"}
                        type={'input'}
                        labelStyle={{ color: Colors.gray }}
                        right={<></>}
                        left={<>
                            <AppImage source={Icons.ic_search} style={Styles.searchIcon} />
                        </>}
                        containerStyle={Styles.search}

                    />

                </View>
                {

                    <View

                        style={{
                            backgroundColor: Colors.white,
                            borderRadius: moderateScale(10),
                            padding: moderateScale(4)
                        }}
                    >
                        <Text style={[FontStyle.bold, {color:Colors.black, paddingTop:moderateScale(10), fontSize:moderateScale(15)}]} >Recent Search</Text>
                        <FlatList
                            data={TestList}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => {
                                        setSelectedPlace({
                                            index: index,
                                            place: item
                                        })
                                    }}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent:'flex-start',
                                            padding: moderateScale(2),
                                            borderRadius: moderateScale(4),
                                            borderBottomColor:Colors.borderColor,
                                            borderBottomWidth: moderateScale(1),
                                            paddingVertical:moderateScale(10)
                                        }}

                                    >
                                        <AppImage source={Icons.ic_recent}  style={{width:moderateScale(24), height:moderateScale(24), marginHorizontal:moderateScale(3)}} />
                                        <Text numberOfLines={1} style={[FontStyle.title, { width: '85%', color:Colors.black }]} >Understanding cardiovascular</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />

                    </View>
                }

            </View>
        </AppSafeAreaView>
    </>)
}

// const ToggleBtn = ()=>{
//     return(
//         (false)?
//         <View style={[s`rounded-full items-center justify-center`,{backgroundColor:PRIMARY_COLOR, width:25, height:25 }]}>
//             <FontAwesome6 name={'check'} color={'white'} size={15} />
//         </View>:
//         <View style={[s`rounded-full items-center justify-center`,{borderColor:'rgba(219, 219, 219, 1)', borderWidth:1, width:25, height:25 }]}>

//         </View>
//     )
// }

const Styles = StyleSheet.create({
    selectContainer: {
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    ctaBtn: {
        width: '80%',

    },
    ctaBtnLabel: {
        fontWeight: "600"
    },
    ctaIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginHorizontal: 8
    },
    searchContainer: {
        marginVertical: 20,
        width: '100%',
        padding: moderateScale(12),
        alignSelf: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    search: {
        backgroundColor: '#9EA0A733',
        width: '90%',
        padding: moderateScale(5),
        justifyContent: 'flex-start'
    },
    searchIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
        marginRight: moderateScale(4)
    }
});

export default Search;
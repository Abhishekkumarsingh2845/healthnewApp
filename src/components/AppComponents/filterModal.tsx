import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Size} from '../../config/size.config';
import {Colors} from '../../config/colors.config';
import AppBottomSheet from '../AppBottomSheet';
import {FontStyle, Style} from '../../config/style.config';
import AppButton from '../AppButton';
import {moderateScale} from 'react-native-size-matters';
import SearchBar from '../SearchBar';
import Icons from 'react-native-vector-icons/AntDesign';
import CheckBox from '../CheckBox';
import {AppBlurModalPropType} from '../AppBlurModal';
import {useQuery, useRealm} from '@realm/react';
import FilterCategory from '../../store/filtercategory/filtercatergory.schema';
import {Image} from 'react-native';
import {Fonts} from '../../config/font.config';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Article from '../../store/article/article.schema';
import {useGetArticles} from '../../store/article/article.hooks';
interface FilterModalPropType extends AppBlurModalPropType {}
const intailFilterOptions = [
  {
    title: 'Categories',
    isApplied: true,
  },
  {
    title: 'Sort By',
    isApplied: false,
  },
  {
    title: 'Date',
    isApplied: false,
  },
];

const FilterModal = props => {
  const [filterOptions, setFilterOptions] = useState([
    {title: 'Categories'},
    {title: 'Sort By'},
    {title: 'Date'},
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const realm = useRealm();



  // const allArticles = useGetArticles();
  // const startDate = new Date('2024-12-17T06:43:40.179Z');
  // const endDate = new Date('2024-12-17T06:49:07.000Z');
  // const fsss = allArticles.filter(article => {
  //   const updatedAt = new Date(article.updatedAt).getTime();
  //   return updatedAt >= startDate.getTime() && updatedAt <= endDate.getTime();
  // });



  // console.log('pppppppppppppppppppp', fsss);

  const handleApplyFilter = () => {
    try {
      if (selectedCategory) {
        realm.write(() => {
          // Clear existing categories
          realm.delete(realm.objects(FilterCategory));

          // Add the selected category
          realm.create(FilterCategory, {id: 1, name: selectedCategory});
        });
      } else {
        // Clear filters if no category is selected
        realm.write(() => {
          realm.delete(realm.objects(FilterCategory));
        });
      }
      props.modalClose(false); // Close the modal
    } catch (error) {
      console.error('Realm error:', error);
    }
  };

  return (
    <>
      <AppBottomSheet
        modalVisible={props.modalOpenFlag}
        setModalVisible={props.modalClose}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: moderateScale(10),
              }}>
              <Text style={{fontWeight: 'bold', color: Colors.black}}>
                Filter(3)
              </Text>
              <TouchableOpacity onPress={() => props.modalClose(false)}>
                <Text style={{color: Colors.black}}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: '35%',
                  height: '100%',
                  borderRightWidth: 1,
                  borderColor: Colors.borderColor,
                  paddingRight: moderateScale(15),
                }}>
                {filterOptions.map((item, index) => (
                  <Pressable
                    key={`filter-${index}`}
                    onPress={() => setSelectedIndex(index)}
                    style={[
                      styles.btn,
                      index !== selectedIndex && {
                        backgroundColor: 'transparent',
                      },
                    ]}>
                    <Text
                      style={{
                        color:
                          index === selectedIndex ? Colors.white : Colors.black,
                      }}>
                      {item.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  paddingHorizontal: moderateScale(4),
                }}>
                {selectedIndex === 0 && (
                  <Categories
                    selected={selectedCategory}
                    setSelected={setSelectedCategory}
                  />
                )}
                {selectedIndex === 1 && <SortBy />}
                {selectedIndex === 2 && <Date />}
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: moderateScale(10),
            }}>
            <AppButton
              label="Cancel"
              textStyle={styles.textPrimary}
              btnstyle={{...styles.actionBtn, ...styles.borderedActionBtn}}
              onClick={() => props.modalClose(false)}
            />
            <AppButton
              label="Apply Filter"
              btnstyle={styles.actionBtn}
              onClick={handleApplyFilter}
            />
          </View>
        </ScrollView>
      </AppBottomSheet>
    </>
  );
};

const Categories = ({
  selected,
  setSelected,
}: {
  selected: string | null;
  setSelected: (category: string | null) => void;
}) => {
  const categories = [
    'Technology Health',
    'Physical Health',
    'Financial Health',
    'Community Health',
    'Occupational Health',
    'Environmental Health',
    'Medical Health',
  ];
  const [data, setdata] = useState('');
  const [query, setquery] = useState('');
  const handleSelectCategory = (category: string): void => {
    setSelected(selected === category ? null : category);
  };

  const searchdata = categories.filter(item =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={categorStyle.container}>
      <Text style={[FontStyle.bold, {color: Colors.black}]}>Categories</Text>
      <Text style={[FontStyle.regular, {color: Colors.black}]}>
        Select the category which you want to see.
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          borderWidth: 1.5,
          borderColor: '#EDF1F3',
          borderRadius: 10,
          // paddingVertical: 1,
        }}>
        <Image
          source={require('../../../assets/images/ss.png')}
          style={{width: 18, height: 18, marginLeft: 10}}
        />

        <TextInput
          value={query}
          onChangeText={setquery}
          placeholder="Search By Interest"
          placeholderTextColor={'black'}
          style={{
            // borderWidth: 1.5,
            // borderRadius: 8,
            paddingVertical: 10,
            fontSize: 15,
            fontFamily: Fonts.medium,
            fontWeight: '400',
            marginLeft: 10,
            // borderColor: '#EDF1F3',
            // paddingLeft: 20,
            // width:"100%"
            // backgroundColor:"red",
            flex: 1,
          }}
        />
      </View>

      <View style={{paddingVertical: 0, paddingHorizontal: 10}}>
        {searchdata.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              paddingVertical: 6,
              backgroundColor:
                selected === category ? 'transparent' : 'transparent',
              borderRadius: 5,
            }}
            onPress={() => handleSelectCategory(category)}>
            <View
              style={{
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor:
                  selected === category ? 'transparent' : 'transparent',
                marginRight: 10,
                borderRadius: 5,
              }}>
              {selected === category && (
                <Image
                  source={require('./../../../assets/images/check.png')}
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: 'contain',
                  }}
                />
              )}
            </View>
            <Text style={{color: 'black'}}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// const Categories = ({
//   selected,
//   setSelected,
// }: {
//   selected: string | null;
//   setSelected: (category: string | null) => void;
// }) => {
//   const categories = [
//     'Technology Health',
//     'Physical Health',
//     'Financial Health',
//     'Community Health',
//     'Occupational Health',
//     'Environmental Health',
//     'Medical Health',
//   ];

//   const [query, setQuery] = useState('');

//   const handleSelectCategory = (category: string): void => {
//     setSelected(selected === category ? null : category);
//   };

//   // Filtered data based on search query
//   const searchData = categories.filter(item =>
//     item.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
//         Categories
//       </Text>
//       <Text style={{ fontSize: 16, color: 'black', marginBottom: 10 }}>
//         Select the category which you want to see.
//       </Text>

//       {/* Search Bar */}
//       <TextInput
//         value={query}
//         onChangeText={setQuery}
//         placeholder="Search category"
//         style={{
//           backgroundColor: 'lightgray',
//           padding: 10,
//           borderRadius: 5,
//           marginBottom: 20,
//         }}
//       />

//       {/* Category List */}
//       <View style={{height:450}}>
//         {searchData.map((category, index) => (
//           <TouchableOpacity
//             key={index}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               padding: 10,
//               height:50,
//               borderRadius: 5,
//               marginBottom: 10,
//             }}
//             onPress={() => handleSelectCategory(category)}>
//             <View
//               style={{
//                 width: 20,
//                 height: 20,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderWidth: 1,
//                 borderColor: '#000',
//                 marginRight: 10,
//                 borderRadius: 5,
//               }}>
//               {selected === category && (
//                 <Image
//                   source={require('./../../../assets/images/check.png')}
//                   style={{ width: 16, height: 16, resizeMode: 'contain' }}
//                 />
//               )}
//             </View>
//             <Text style={{ color: 'black' }}>{category}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

const SortBy = () => {
  const [selectedIndex, setSeletedIndex] = useState<number>(0);

  return (
    <View>
      <View style={categorStyle.container}>
        <Text style={[FontStyle.bold, {color: Colors.black}]}>Sort By</Text>

        <Text style={[FontStyle.regular, {color: Colors.black}]}>
          Select the sorting which you want to see.
        </Text>

        <View style={{padding: moderateScale(10), width: '100%'}}>
          <View
            style={{
              marginLeft: moderateScale(4),
              minHeight: Size.screenHeight * 0.25,
            }}>
            {['Relevance', 'Latest'].map((item, index) => {
              return (
                <View
                  key={`sort-${index}`}
                  style={[
                    Style.flexRow,
                    {
                      paddingVertical: moderateScale(10),
                    },
                  ]}>
                  <Pressable
                    onPress={() => {
                      setSeletedIndex(index);
                    }}
                    style={sortStyle.radioBtn}>
                    <View
                      style={{
                        backgroundColor:
                          index == selectedIndex ? Colors.black : Colors.white,
                        flex: 1,
                        borderRadius: moderateScale(20),
                      }}
                    />
                  </Pressable>
                  <Text>{item}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};
const Date = () => {
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const check = useQuery(Article);
  console.log('dd', check);
  const [todate, tosetdate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentField, setCurrentField] = useState<string>('');

  const showDatePicker = (field: 'from' | 'to'): void => {
    setCurrentField(field); // Set which field is being updated
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };



 
  const handleConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString();

    // Conditionally update based on currentField
    if (currentField === 'from') {
      setSelectedDate(formattedDate);
    } else if (currentField === 'to') {
      tosetdate(formattedDate);
    }

    hideDatePicker();
  };
  return (
    <View>
      <View style={categorStyle.container}>
        <Text style={[FontStyle.bold, {color: Colors.black}]}>Date wise</Text>

        <Text style={[FontStyle.regular, {color: Colors.black}]}>
          Select the date which you want to see.
        </Text>

        <Text
          style={[
            FontStyle.titleSemibold,
            {color: Colors.black, fontSize: moderateScale(16)},
          ]}>
          Date Range
        </Text>

        <View style={{padding: moderateScale(10), width: '100%'}}>
          <View
            style={{
              marginLeft: moderateScale(4),
              minHeight: Size.screenHeight * 0.25,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}
              onPress={() => showDatePicker('from')}>
              <Text>From:</Text>
              <View
                style={[
                  Style.flexRow,
                  {
                    paddingVertical: moderateScale(10),
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                  },
                ]}>
                <View style={[Style.flexRow, dateStyle.dateFeild]}>
                  {selectedDate ? (
                    <Text>{selectedDate}</Text>
                  ) : (
                    <Text>dd/mm/yyyy</Text>
                  )}
                  <Icons
                    name={'calendar'}
                    color={Colors.gray}
                    size={moderateScale(16)}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}
              onPress={() => showDatePicker('to')}>
              <Text>To:</Text>
              <View
                style={[
                  Style.flexRow,
                  {
                    paddingVertical: moderateScale(10),
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                  },
                ]}>
                <View style={[Style.flexRow, dateStyle.dateFeild]}>
                  {todate ? <Text>{todate}</Text> : <Text>dd/mm/yyyy</Text>}
                  <Icons
                    name={'calendar'}
                    color={Colors.gray}
                    size={moderateScale(16)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const categorStyle = StyleSheet.create({
  container: {paddingHorizontal: moderateScale(4), gap: moderateScale(10)},
  selectBtn: {
    gap: moderateScale(3),
    minWidth: moderateScale(100),
    backgroundColor: Colors.borderColor,
    padding: moderateScale(6),
    borderRadius: moderateScale(4),
  },
  unselectedBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  search: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: moderateScale(12),
    width: '100%',
  },
  checkboxContainer: {
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 1,
    paddingVertical: moderateScale(10),
  },
});

const sortStyle = StyleSheet.create({
  radioBtn: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(100),
    borderColor: Colors.black,
    borderWidth: 1,
    overflow: 'hidden',
    padding: moderateScale(3),
    marginRight: moderateScale(5),
  },
});

const dateStyle = StyleSheet.create({
  dateFeild: {
    gap: moderateScale(4),
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    marginLeft: moderateScale(6),
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    position: 'absolute',
  },
  contentContainer: {},
  inActiveBtn: {},
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
    alignItems: 'center',
    marginTop: moderateScale(10),
    borderRadius: moderateScale(8),
  },
  text: {
    color: Colors.white,
  },
  actionBtn: {
    width: '45%',
    borderRadius: moderateScale(10),
  },
  borderedActionBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textPrimary: {
    color: Colors.primary,
  },
});

export default FilterModal;

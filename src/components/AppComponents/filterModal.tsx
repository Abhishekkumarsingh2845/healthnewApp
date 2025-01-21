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
import Datesch from '../../store/trending/datee/date.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState<string>(''); // Store selected 'from' date
  const [todate, tosetdate] = useState<string>(''); // Store selected 'to' date
  const handleClearAll = () => {
    setSelectedCategory(null); // Reset the selected category
    setDateFilter(null); // Reset the date filter if needed
    setSelectedIndex(0); // Optionally, reset the selected tab
    // props.modalClose(false); // Close the modal
    setSelectedDate(''); // Reset 'from' date
    tosetdate(''); // Reset 'to' date
    realm.write(() => {
      realm.delete(realm.objects(FilterCategory));
    });
    realm.write(() => {
      const allDates = realm.objects(Datesch);
      realm.delete(allDates);
    });
  };

  const handleApplyFilter = () => {
    try {
      console.log('Date Filter:', dateFilter);

      if (selectedIndex === 2 && dateFilter) {
        dateFilter();
      }
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
              <TouchableOpacity
                onPress={handleClearAll}

                // onPress={
                //   () =>
                //   {
                //     setSelectedCategory(null);
                //     props.modalClose(false)
                //     }}
              >
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
                {/* {selectedIndex === 2 && <Datee />} */}
                {selectedIndex === 2 && <Datee onHandleDate={setDateFilter} />}
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
    'Wholesome Originals',
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
    <KeyboardAvoidingView
       style={{height:600}}>
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
    </KeyboardAvoidingView>
  );
};

const SortBy = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Load the selected index from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSelectedIndex = async () => {
      try {
        const storedIndex = await AsyncStorage.getItem('selectedIndex');
        if (storedIndex !== null) {
          setSelectedIndex(parseInt(storedIndex, 10)); // Parse the value as a number
        }
      } catch (error) {
        console.error('Error loading selected index:', error);
      }
    };

    loadSelectedIndex();
  }, []);

  // Save the selected index to AsyncStorage when it changes
  const handleSelection = async (index: number) => {
    try {
      await AsyncStorage.setItem('selectedIndex', index.toString());
      setSelectedIndex(index);
    } catch (error) {
      console.error('Error saving selected index:', error);
    }
  };

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
                    onPress={() => handleSelection(index)}
                    style={sortStyle.radioBtn}>
                    <View
                      style={{
                        backgroundColor:
                          index === selectedIndex ? Colors.black : Colors.white,
                        flex: 1,
                        borderRadius: moderateScale(20),
                      }}
                    />
                  </Pressable>

                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.medium,
                      color: 'black',
                    }}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default SortBy;

const Datee = ({
  onHandleDate,
}: {
  onDateRangeChange: (range: {startDate: string; endDate: string}) => void;
  onHandleDate: (handleDate: () => void) => void;
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const check = useQuery(Article);
  // console.log('dd', check);
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
  const allArticles = useGetArticles();

  // console.log('allArticles---->', JSON.stringify(allArticles));
  const realm = useRealm();

  useEffect(() => {
    if (allArticles) {
      FilterData(allArticles);
    }
  }, [allArticles]);

  const handleDate = useCallback(() => {
    try {
      realm.write(() => {
        const allDates = realm.objects(Datesch);
        realm.delete(allDates); // Clear previous dates
        const isButtonPressed = selectedDate && todate ? true : false;
        realm.create(Datesch, {
          startDate: selectedDate,
          endDate: todate,
          isButtonPressed,
        });
      });
    } catch (error) {
      console.error('Realm error:', error);
    }
  }, [selectedDate, todate]);

  useEffect(() => {
    if (onHandleDate) {
      onHandleDate(() => handleDate);
    }
  }, [handleDate]);

  const FilterData = (allArticles: any) => {
    const startDate = new Date(selectedDate);
    const endDate = new Date(todate);
    // console.log('startdate type', typeof startDate);
    const fsss = allArticles.filter(
      (article: {updatedAt: string | number | Date}) => {
        const updatedAt = new Date(article.updatedAt).getTime();
        return (
          updatedAt >= startDate.getTime() && updatedAt <= endDate.getTime()
        );
      },
    );
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];

    // Conditionally update based on currentField
    if (currentField === 'from') {
      setSelectedDate(formattedDate);
      // console.log('kk', setSelectedDate);
    } else if (currentField === 'to') {
      tosetdate(formattedDate);
    }

    hideDatePicker();
    // console.log('fromdata', selectedDate);
    // console.log('fromdata', todate);
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

        {/* <TouchableOpacity onPress={handleDate}>
          <Text>press</Text>
        </TouchableOpacity> */}

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
                // backgroundColor: 'red',
              }}
              onPress={() => showDatePicker('from')}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Fonts.medium,
                  color: 'black',
                }}>
                From:
              </Text>
              <View
                style={[
                  Style.flexRow,
                  {
                    paddingVertical: moderateScale(10),
                    flexWrap: 'nowrap',
                    // backgroundColor: 'green',
                    justifyContent: 'space-between',
                  },
                ]}>
                <View
                  style={{
                    width: 130,
                    height: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: 'grey',
                    marginLeft: 10,
                    paddingHorizontal: 10,
                    // paddingVertical:10,
                  }}>
                  {selectedDate ? (
                    <Text style={{color: 'black', fontSize: 12}}>
                      {selectedDate}
                    </Text>
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
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Fonts.medium,
                  color: 'black',
                }}>
                To:
              </Text>
              <View
                style={[
                  Style.flexRow,
                  {
                    paddingVertical: moderateScale(10),
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    marginLeft: 15,
                  },
                ]}>
                <View
                  style={{
                    width: 130,
                    height: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: 'grey',
                    marginLeft: 10,
                    paddingHorizontal: 10,
                    // paddingVertical:10,
                  }}>
                  {todate ? (
                    <Text style={{color: 'black', fontSize: 12}}>{todate}</Text>
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

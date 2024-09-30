
import { DrawerContent, DrawerContentComponentProps, createDrawerNavigator, useDrawerProgress } from '@react-navigation/drawer';
import Home from '../../screens/Home';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Modal, ViewStyle } from 'react-native';
import { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Wrapper from './wrapper';
import CustomDrawerContent from './customDrawerContent';

import { Screen } from '../MainNavigation/models';
import BottomNavigation from '../BottomNavigation';
import { Colors } from '../../config/colors.config';
import CallRequest, { CallRequestPropType } from '../../screens/callRequest';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { WaitingType } from '../../store/interfaces';
const Drawer = createDrawerNavigator();

const intaialData:CallRequestPropType = {
    image: '',
    type: '',
    name: '',
    orderId: '',
    waitingid: '',
    astroid: '',
    orderTime: 0
}
const DrawerNavigation = () => {
    const [callRequestDetails, setCallRequestDetails] = useState<CallRequestPropType>(intaialData);
    const userStore = useSelector((state: RootState) => state.user);
    const [show , setShow] = useState(false);
    // const [progress, setProgress] = useState(new Animated.Value(0));
    const listenWaitingList = () => {
        return firestore()?.collection('Users')?.doc(userStore.user.CustomerId.toString()).collection('waitingList').onSnapshot((snapShot) => {
            // console.log(snapShot.docs, 'SNAPSHOT');
            const data: Array<WaitingType> = snapShot?.docs?.map((item, index) => {
                // console.log('ITEM.....');
                // console.log(item, 'item')
                // @ts-ignore
                if (item._data) {
                    // @ts-ignore
                    const data: WaitingType = item._data;
                    if (data.orderStatus == "2" && data.ordertype!='lcall' ) {
                        // @ts-ignore
                        setCallRequestDetails({
                            image: data.astrologerInfo.newImage,
                            type: data.ordertype,
                            name: data.astrologerInfo.fullName,
                            orderId: data.orderid,
                            waitingid: data.id,
                            astroid:data.astroid.toString(),
                            orderTime:data.orderTime
                        })
                        setShow(true);
                    }
                }
                // @ts-ignore
                return item?._data as any
            });
        })
    }

    const onClose = useCallback(()=>{
            setShow(false);
    },[])

    useEffect(() => {
        const subcribe =  listenWaitingList();
        return subcribe;
    }, [])
    return (
        <>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                initialRouteName='Home'
                screenOptions={{
                    drawerType: 'front',
                    headerShown: false,
                    // overlayColor: 'transparent',
                    drawerStyle: {
                        width: '80%',
                        backgroundColor: '#5F3C8C',
                    },
                }}
            >
                {
                    DrawerScreen.map((item, index) => {
                        return <Drawer.Screen
                            name={item.name} component={item.screen} key={item.name} initialParams={{ withDrawer: true }} />
                    })
                }

            </Drawer.Navigator>
            <Modal visible={show} statusBarTranslucent={true} animationType={'slide'}>
                <CallRequest
                    {...callRequestDetails}
                    onClose={onClose}
                />
            </Modal>
        </>
    )
}
const DrawerScreen: Array<Screen> = [
    {
        name: 'BottomNavigation',
        screen: BottomNavigation,
    },

]
export default DrawerNavigation;
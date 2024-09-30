import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet, View } from 'react-native';

import TabIcon, { TabIconProps } from './TabIcon';

import { ReactNode } from 'react';
import { Colors } from '../../config/colors.config';
import { Size } from '../../config/size.config';
import { BottomTab, SVG } from '../../generated/image.assets';
import Home from '../../screens/home';
import { moderateScale } from 'react-native-size-matters';
import Astrologers from '../../screens/astrologers';
import ChatWithAstrologer from '../../screens/chatWithAstrloger';
import LiveAstrologers from '../../screens/liveAstrologers';
import { BlurView } from '@react-native-community/blur';

// import EventCalender from '../../screens/Menu/';



const Tab = createBottomTabNavigator();

function BottomNavigation() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBarStyle,
            }}
            

        >
            {
                Tabs.map((item, index) => {
                    return (
                        <Tab.Screen key={item.name} name={item.name} component={item.component}
                            initialParams={item.initialParams}
                            options={{
                                tabBarIcon: ({ focused }) => {
                                    return <TabIcon
                                        label={item.label}
                                        icon={item.icon}
                                        activeIcon={item.activeIcon}
                                        isLastIndex={index==(Tabs.length-1)}
                                        isStartIndex={index==0}
                                        isActive={focused}
                                    />
                                }
                            }}
                        />
                    )
                })
            }
        </Tab.Navigator>
    );
}
const styles = StyleSheet.create({
    tabBarStyle: {
        // backgroundColor: Colors.primary,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation:0,
        position:"absolute",
        height: moderateScale(55),
        
    }
})
interface TabType extends TabIconProps {
    name: string;
    component: (props:any) => JSX.Element| ReactNode;
    initialParams?:any
}
const Tabs: Array<TabType> = [
    {
        name: 'Call',
        component: Astrologers,
        label: 'Chat',
        icon: BottomTab.in_call,
        activeIcon: BottomTab.ac_call,
        initialParams:{
            type:"call"
        }
        

    },
    {
        name: 'Chat',
        component: Astrologers,
        label: 'Chat',
        icon: BottomTab.in_chat,
        activeIcon: BottomTab.ac_chat,
        initialParams:{
            type:"chat"
        }

    },
    {
        name: 'Home',
        component: Home,
        label: 'Home',
        icon: BottomTab.in_home,
        activeIcon: BottomTab.ac_home,
    },
    {
        name: 'My Orders',
        component: Astrologers,
        label: 'Video',
        icon: BottomTab.in_video,
        activeIcon: BottomTab.ac_video,
        initialParams:{
            type:"vcall"
        }

    },
    {
        name: 'Menu',
        component: LiveAstrologers,
        label: 'Live',
        icon: BottomTab.in_live,
        activeIcon: BottomTab.ac_live,
    },

]
export default BottomNavigation
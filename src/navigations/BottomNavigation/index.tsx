import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet, View } from 'react-native';
import TabIcon, { TabIconProps } from './TabIcon';
import { ReactNode } from 'react';
import { Colors } from '../../config/colors.config';
import { Size } from '../../config/size.config';
import { moderateScale } from 'react-native-size-matters';
import Explore from '../../screens/explore';
import Favorite from '../../screens/favorite';
import Profile from '../../screens/profile';
import { Icons } from '../../generated/image.assets';



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
        backgroundColor: Colors.primary,
        borderTopWidth: 0,
        elevation:0,
        position:"absolute",
        height: moderateScale(60),
        
    }
})
interface TabType extends TabIconProps {
    name: string;
    component: (props:any) => JSX.Element| ReactNode;
    initialParams?:any
}
const Tabs: Array<TabType> = [
    {
        name: 'Explore',
        component: Explore,
        label: 'Explore',
        icon: Icons.ic_explore,
        activeIcon: Icons.ic_active_explore,
    },
    {
        name: 'Favorite',
        component: Favorite,
        label: 'Favorite',
        icon: Icons.ic_fav,
        activeIcon: Icons.ic_active_love,
        

    },
    {
        name: 'Profile',
        component: Profile,
        label: 'Profile',
        icon: Icons.ic_profile,
        activeIcon: Icons.ic_active_profile,
    },
    

]
export default BottomNavigation
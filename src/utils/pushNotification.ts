import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, AndroidVisibility, EventType } from '@notifee/react-native';
import { Colors } from '../config/colors.config';
// import FileViewer from 'react-native-file-viewer';
// import * as NavigationService from "react-navigation-helpers";
// import ReactNativeBlobUtil from 'react-native-blob-util'
export const getDeviceToken = async (): Promise<string> => {
    const token: string = await messaging().getToken();
    console.log("device token ", token);
    return token;
}

export const createPushNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> => {
    try{

        console.log('remoteMessage ', remoteMessage);
        const route: string = remoteMessage?.data?.route?.toString() ?? "Notification";
        const data: string = remoteMessage?.data?.data?.toString()??"";
        // Request permissions (required for iOS)
        await notifee.requestPermission()
    
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'fcm_fallback_notification_channel',
            name: 'fcm_fallback_notification_channel',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
        });
    
        // Display a notification
        await notifee.displayNotification({
            title: remoteMessage.data?.title.toString()??"",
            android: {
                channelId,
                color: Colors.primary,
                smallIcon: 'drawable/ic_logo', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
                style: { type: AndroidStyle.BIGTEXT, text: remoteMessage.data?.message.toString() ?? "" },
            },
        });
    }catch(error){
        console.log(error, 'error')
    }
    // const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
    //     if (type == EventType.PRESS) {
    //         pressNotificationRouteFun(route,true,data);
    //     }
    //     unsubscribe();
    // });
}



// interface foregroundNotificationInterface {
//     title: string,
//     desc: string
// }
// export const foregroundNotification = async ({ title, desc }: foregroundNotificationInterface) => {
//     console.log('create notification...');
//     const notificationId = "videoCallsddd";
//     // Request permissions (required for iOS)
//     await notifee.requestPermission()

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//         id: 'videoCall',
//         name: 'Vetlab Video Call',
//         importance: AndroidImportance.HIGH,
//         visibility: AndroidVisibility.PUBLIC,
//     });

//     // Display a notification
//     await notifee.displayNotification({
//         id: notificationId,
//         title: `<b  style="color: #FF8C00;">${title}</b>`,
//         body: desc,

//         android: {
//             color: PRIMARY_COLOR,
//             channelId,
//             ongoing: true,
//             autoCancel: false,
//             // color:ORANGE_COLOR,
//             smallIcon: 'ic_logo', // optional, defaults to 'ic_launcher'.
//             // pressAction is needed if you want the notification to open the app when pressed
//             pressAction: {
//                 id: 'one',
//                 launchActivity: 'com.app.vetlab.CustomActivity',
//             },
//             actions: [
//                 {
//                     title: `<p style="color: #FC3400;"><b>Hang Up</span></p></b></p>`,
//                     pressAction: { id: 'hangup' },
//                 },
//                 // {
//                 //   title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
//                 //   pressAction: { id: 'cry' },
//                 // },
//             ],
//         },
//     });
//     const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
//         // console.log(EventType.PRESS,' dskfsdjfl')
//         // if(EventType.PRESS){
//         //     // @ts-ignore 
//         //     notifee.displayNotification(detail);
//         // }
//         if (type === EventType.ACTION_PRESS && detail?.pressAction?.id!) {
//             notifee.cancelNotification(notificationId)
//             console.log('User pressed an action with the id: ', detail.pressAction.id);
//         }
//         unsubscribe();
//     });
// }


// export const fileDownloadNotification = async (title: string, body: string, path: string): Promise<void> => {

//     await notifee.requestPermission();
//     const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
//         switch (type) {
//             case EventType.PRESS:
//                 console.log(path, 'path...')
//                 notifee.stopForegroundService();
//                 unsubscribe();
//                 FileViewer.open(`${path}`,)
//                 console.log('User pressed notification', detail.notification);
//                 break;
//         }
//     });
//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//         id: 'download',
//         name: 'file download',
//         importance: AndroidImportance.HIGH,
//         visibility: AndroidVisibility.PUBLIC,
//     });

//     // Display a notification
//     await notifee.displayNotification({
//         title: title,
//         body: body,
//         android: {
//             channelId,
//             color: PRIMARY_COLOR,
//             smallIcon: 'ic_logo', // optional, defaults to 'ic_launcher'.
//             // pressAction is needed if you want the notification to open the app when pressed
//             pressAction: {
//                 id: 'default',
//             },
//         },
//     });
// }

// export const pressNotificationRouteFun = (route: string,withDefault:boolean,payload:string) => {
//     console.log(route, 'route...');
//     switch (route) {
//         case "HealthReports":
//             NavigationService.push(route, { intialIndex: 1 });
//             break;
//         case "TestReport":
//             NavigationService.push('HealthReports', { intialIndex: 0 });
//             break;
//         case "AppointmentDetails":
//             console.log(payload,'payload')
//             if(payload!=""){
//                 NavigationService.push('AppointmentDetails', JSON.parse(payload));
//             }
//             break;
//         default: (withDefault)&& NavigationService.push(route,);
//     }
// }
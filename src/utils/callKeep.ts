import RNCallKeep, { IOptions } from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import Store from '../../src/store';

const options: IOptions = {
  ios: {
    appName: 'My app name',
    includesCallsInRecents: false,

  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    additionalPermissions: [],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.company.my',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    },
  }
};

export const initializeCallKeep = async () => {
  RNCallKeep.registerPhoneAccount(options);
  try {
    return await RNCallKeep.setup(options).then(accepted => {
      // console.log(accepted,'call permisioss...')
      if(!accepted){

        RNCallKeep.registerPhoneAccount(options);
      }
      return true;
    }).catch(() => {
      return false;
    })
    // startListingCallKeep();


  } catch (error) {
    return false;
    // console.log(error,)
  }
}

// export const startListingCallKeep = ()=>{
//         RNCallKeep.addEventListener('answerCall',()=>{
//             RNCallKeep.endCall('1234');

//         })
//         RNCallKeep.addEventListener('endCall',()=>{
//             RNCallKeep.endCall('1234');
//         })
// }

export const stopListeningCallKeep = () => {

}

interface ReceiveCallInvitationType{
  title:string,
  senderId:string,
  appointmentId:string,
  channelName:string
}
export const ReceiveCallInvitation = ({title,senderId, appointmentId, channelName}:ReceiveCallInvitationType)=>{
  
  const id = uuid.v4().toString();
  // RNCallKeep.displayIncomingCall(
  //   id,
  //   title,
  //   title,
  //   'number',
  //   true,
  // );
  // Store.dispatch(addVideoCallDetials(
  //   {
  //     appointmentId: appointmentId,
  //     channelName: channelName,
  //     senderId: senderId
  //   }
  // ));
  // RNCallKeep.addEventListener('endCall', () => {
  //    console.log("END CALL FROM RECEIVE NOTIFICATION")
  //   // RNCallKeep.removeEventListener('endCall');
  //   // EndCall({ doctorId: senderId, appointmentId: appointmentId });
  // })
}




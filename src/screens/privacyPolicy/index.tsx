// import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
// import AppImage from '../../components/AppImage';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import {Images} from '../../generated/image.assets';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle} from '../../config/style.config';
// import {Fonts} from '../../config/font.config';
// import {useEffect, useState} from 'react';
// import {Endpoint} from '../../config/network.config';

// const PrivacyPolicy = () => {
//   const [details, setDetails] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true); // Loading state
//   const [error, setError] = useState<string>('');
//   const [update, setupdate] = useState<string>('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await Endpoint.get('privacypolicy'); // Call the endpoint

//         if (response.data.status) {
//           // Extracting details from the second item
//           setDetails(response.data.data[0].details);
//           const updatetime = new Date(
//             response.data.data[0].createdAt,
//           ).toLocaleDateString('en-GB');
//           setupdate(updatetime);
//           console.log('->>>>>>', response);
//         } else {
//           setError('Failed to load data.');
//         }
//       } catch (error: any) {
//         setError('Error fetching data: ' + error.message);
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//       <AppSafeAreaView title="Privacy Policy">
//         <Image
//           source={Images.appLogo}
//           resizeMode={'contain'}
//           tintColor={Colors.primary}
//           style={styles.logo}
//         />
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={{margin: moderateScale(4)}}>
//             <Text style={[FontStyle.regular, styles.date]}>
//               Last update: {update}
//             </Text>
//             <Text style={[FontStyle.regular, styles.content]}>
//               Please read these privacy policy, carefully before using our app
//               operated by us.
//             </Text>
//             <Text style={[FontStyle.bold, styles.heading]}>Privacy Policy</Text>

//             {loading ? (
//               <Text style={[FontStyle.regular, styles.content]}>
//                 Loading...
//               </Text>
//             ) : error ? (
//               <Text
//                 style={[
//                   FontStyle.regular,
//                   styles.content,
//                   {color: Colors.red},
//                 ]}>
//                 {error}
//               </Text>
//             ) : (
//               <Text  style={[FontStyle.regular, styles.content]}>{details}</Text>
//             )}
//           </View>
//         </ScrollView>
//       </AppSafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   logo: {
//     height: moderateScale(40),
//     width: moderateScale(120),
//     marginVertical: moderateScale(3),
//   },
//   date: {
//     marginVertical: moderateScale(5),
//     color: Colors.gray,
//   },
//   content: {
//     marginVertical: moderateScale(5),
//     color: Colors.black,
//     fontSize: moderateScale(16),
//     lineHeight: moderateScale(23),
//   },
//   heading: {
//     color: Colors.primary,
//     fontSize: moderateScale(19),
//     marginVertical: moderateScale(5),
//   },
// });
// export default PrivacyPolicy;

import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import RenderHTML from 'react-native-render-html';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import {Images} from '../../generated/image.assets';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {FontStyle} from '../../config/style.config';
import {useEffect, useState} from 'react';
import {Endpoint} from '../../config/network.config';
import {useWindowDimensions} from 'react-native'; // To get device width for RenderHTML
import {Fonts} from '../../config/font.config';

const PrivacyPolicy = () => {
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>('');
  const [update, setupdate] = useState<string>('');
  const {width} = useWindowDimensions(); // Get device width

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Endpoint.get('privacypolicy'); // Call the endpoint

        if (response.data.status) {
          // Extracting details from the second item
          setDetails(response.data.data[0].details);
          const updatetime = new Date(
            response.data.data[0].updatedAt,
          ).toLocaleDateString('en-GB');
          setupdate(updatetime);
          console.log('->>>>>>', response);
        } else {
          setError('Failed to load data.');
        }
      } catch (error: any) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AppSafeAreaView title="Privacy Policy">
        <Image
          source={Images.appLogo}
          resizeMode={'contain'}
          tintColor={Colors.primary}
          style={styles.logo}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{margin: moderateScale(4)}}>
            <Text style={[FontStyle.regular, styles.date]}>
              Last update: {update}
            </Text>
            <Text style={[FontStyle.regular, styles.content]}>
              Please read these privacy policy, carefully before using our app
              operated by us.
            </Text>
            <Text style={[FontStyle.bold, styles.heading]}>Privacy Policy</Text>

            {loading ? (
              <Text style={[FontStyle.regular, styles.content]}>
                Loading...
              </Text>
            ) : error ? (
              <Text
                style={[
                  FontStyle.regular,
                  styles.content,
                  {color: Colors.red},
                ]}>
                {error}
              </Text>
            ) : (
              <RenderHTML
                contentWidth={width} // Pass device width for proper rendering
                source={{html: details}}
                systemFonts={['CormorantGaramond-Regular']}
                ignoredStyles={['fontFamily', 'color', 'fontSize']}
                tagsStyles={{p: {...FontStyle.regular, ...styles.content}}}
              />
            )}
          </View>
        </ScrollView>
      </AppSafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: moderateScale(40),
    width: moderateScale(120),
    marginVertical: moderateScale(3),
  },
  date: {
    marginVertical: moderateScale(5),
    color: Colors.gray,
  },
  content: {
    marginVertical: moderateScale(5),
    color: Colors.black,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(23),
  },
  heading: {
    color: Colors.primary,
    fontSize: moderateScale(19),
    marginVertical: moderateScale(5),
  },
});
export default PrivacyPolicy;

// import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
// import RenderHTML from 'react-native-render-html';
// import AppSafeAreaView from '../../components/AppSafeAreaView';
// import {Images} from '../../generated/image.assets';
// import {moderateScale} from 'react-native-size-matters';
// import {Colors} from '../../config/colors.config';
// import {FontStyle} from '../../config/style.config';
// import {useEffect, useState} from 'react';
// import {Endpoint} from '../../config/network.config';
// import {useWindowDimensions} from 'react-native'; // To get device width for RenderHTML
// import {Fonts} from '../../config/font.config';

// const PrivacyPolicy = () => {
//   const [details, setDetails] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true); // Loading state
//   const [error, setError] = useState<string>('');
//   const [update, setupdate] = useState<string>('');
//   const {width} = useWindowDimensions(); // Get device width

//   // Example modified HTML content
//   const modifiedHTML = `
//     <div>
//       <h2 style="font-weight:bold; font-size:20px; text-align:center;">
//         Wholesome by WH (“Wholesome”)
//       </h2>
//       <div>
//         <p style="font-size:16px; color:gray; font-style:italic;">Disclaimer</p>
//         <p>Legal Statement</p>
//         <p>
//           By accessing and using this site, you as the user, agree to these terms and conditions.
//           If you do not agree to all of these terms and conditions, do not use this site.
//           Wholesome has the right to change the terms and conditions of use at any time without notice to you.
//           In using this site, you are agreeing to any changes in the terms and conditions of use.
//         </p>
//         <p style="color:#FF5733;">
//           All information contained within this website is intended to be general and/or educational in nature...
//         </p>
//       </div>
//     </div>
//   `;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await Endpoint.get('privacypolicy'); // Call the endpoint

//         if (response.data.status) {
//           // Extracting details from the second item
//           setDetails(response.data.data[0].details);
//           const updatetime = new Date(
//             response.data.data[0].updatedAt,
//           ).toLocaleDateString('en-GB');
//           setupdate(updatetime);
//           console.log('->>>>>>', response);
//         } else {
//           setError('Failed to load data.');
//         }
//       } catch (error: any) {
//         setError('Error fetching data: ' + error.message);
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//       <AppSafeAreaView title="Privacy Policy">
//         <Image
//           source={Images.appLogo}
//           resizeMode={'contain'}
//           tintColor={Colors.primary}
//           style={styles.logo}
//         />
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={{margin: moderateScale(4)}}>
//             <Text style={[FontStyle.regular, styles.date]}>
//               Last update: {update}
//             </Text>
//             <Text style={[FontStyle.regular, styles.content]}>
//               Please read these privacy policy, carefully before using our app
//               operated by us.
//             </Text>
//             <Text style={[FontStyle.bold, styles.heading]}>Privacy Policy</Text>

//             {loading ? (
//               <Text style={[FontStyle.regular, styles.content]}>
//                 Loading...
//               </Text>
//             ) : error ? (
//               <Text
//                 style={[
//                   FontStyle.regular,
//                   styles.content,
//                   {color: Colors.red},
//                 ]}>
//                 {error}
//               </Text>
//             ) : (
//               <RenderHTML
//                 contentWidth={width} // Pass device width for proper rendering
//                 source={{html: modifiedHTML}} // Use the modified HTML content
//                 tagsStyles={{
//                   h2: {
//                     fontSize: 22,
//                     color: '#007BFF',
//                     fontWeight: 'bold',
//                     marginBottom: 10,
//                   },
//                   p: {
//                     fontSize: 16,
//                     color: '#333',
//                     lineHeight: 24,
//                   },
//                   span: {color: '#FF5733'}, // Example for targeting span elements
//                 }}
//                 baseStyle={{
//                   fontFamily: Fonts.medium, // Apply your configured font
//                 }}
//               />
//             )}
//           </View>
//         </ScrollView>
//       </AppSafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   logo: {
//     height: moderateScale(40),
//     width: moderateScale(120),
//     marginVertical: moderateScale(3),
//   },
//   date: {
//     marginVertical: moderateScale(5),
//     color: Colors.gray,
//   },
//   content: {
//     marginVertical: moderateScale(5),
//     color: Colors.black,
//     fontSize: moderateScale(16),
//     lineHeight: moderateScale(23),
//   },
//   heading: {
//     color: Colors.primary,
//     fontSize: moderateScale(19),
//     marginVertical: moderateScale(5),
//   },
// });
// export default PrivacyPolicy;

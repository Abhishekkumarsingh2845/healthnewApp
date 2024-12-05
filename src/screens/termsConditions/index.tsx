import {Image, StyleSheet, Text, View} from 'react-native';
import AppImage from '../../components/AppImage';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import {Images} from '../../generated/image.assets';
import {moderateScale} from 'react-native-size-matters';
import {Colors} from '../../config/colors.config';
import {FontStyle} from '../../config/style.config';
import {Fonts} from '../../config/font.config';
import {useEffect, useState} from 'react';
import {Endpoint} from '../../config/network.config';

const TermsConditions = () => {
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [update, setupdate] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Endpoint.get('aboutget');

        if (response.data.status) {
          setDetails(response.data.data[0].details);
          console.log('->>>>>>', response);
          const updatetime = new Date(
            response.data.data[0].createdAt,
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
      <AppSafeAreaView title="Terms & Conditions">
        <Image
          source={Images.appLogo}
          resizeMode={'contain'}
          tintColor={Colors.primary}
          style={styles.logo}
        />
        <View style={{margin: moderateScale(4)}}>
          <Text style={[FontStyle.regular, styles.date]}>
            Last update: {update}
          </Text>
          <Text style={[FontStyle.regular, styles.content]}>
            Please read these privacy policy, carefully before using our app
            operated by us.
          </Text>
          <Text style={[FontStyle.bold, styles.heading]}>
            Conditions of Uses
          </Text>

          {loading ? (
            <Text style={[FontStyle.regular, styles.content]}>Loading...</Text>
          ) : error ? (
            <Text
              style={[FontStyle.regular, styles.content, {color: Colors.red}]}>
              {error}
            </Text>
          ) : (
            <Text style={[FontStyle.regular, styles.content]}>{details}</Text>
          )}
        </View>
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
export default TermsConditions;

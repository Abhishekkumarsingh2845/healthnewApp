import RazorpayCheckout, { CheckoutOptions, SuccessResponse } from 'react-native-razorpay';
import { ServiceResponse } from './interfaces';
import { CREDENTIALS } from '../config/app.config';
import { Colors } from '../config/colors.config';
interface checkoutFunParams {
    options: CheckoutOptions,
    onSuccess: (res: ServiceResponse) => void,
    onFailed: (res: ServiceResponse) => void,
}
export const razorPayCheckoutFun = ({ options, onSuccess, onFailed }: checkoutFunParams) => {
    const updatedOptions:CheckoutOptions = {...options, 
        currency:'INR',
        key:CREDENTIALS.razorpay_key_id,
        order_id:options.order_id,
        amount:options.amount *100,
        theme: {
            color: Colors.primary,
          }
    };
    const orderId ="order_NxHYDgipd6hBJm";
    // console.log(updatedOptions, 'options..........');
    RazorpayCheckout.open(updatedOptions).then((data: SuccessResponse) => {
        // handle success
        const res: ServiceResponse = {
            status: true,
            message: 'Payment successfully done',
            response: data
        }
        onSuccess(res);
        // alert(`Success: ${data.razorpay_payment_id}`);
    }).catch((error) => {
        // handle failure
        // console.log(error, 'error');
        const res: ServiceResponse = {
            status: false,
            message: `Error: ${error.code} | ${error.description}`,
            response: error
        }
        onFailed(res);
        // alert(`Error: ${error.code} | ${error.description}`);
    });
}


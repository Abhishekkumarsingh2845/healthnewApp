import axios from "axios";
import { ServiceResponse } from "./interfaces";
import { showToastMessage } from "./toast";

export const catchHandling  = (params:any):ServiceResponse =>{
    // console.log(params, 'catch parames...');
    if(axios.isAxiosError(params)){
        // console.log(params, 'catch..')
        showToastMessage(params.response?.data?.message,'error');
        return{
            status:params.response?.data?.success,
            message:params.response?.data?.message,
            response:params.response
        }
    }
    else{
        showToastMessage(params.toString(),'error');
        return{
            status:false,
            message:params 
        }    
    }
    
}
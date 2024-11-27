import { Endpoint } from "../../config/network.config";
import { catchHandling } from "../../utils/errorHandling";
import { ServiceResponse } from "../../utils/interfaces";

export const fetchLatestArticles = async (params:{page:number}): Promise<ServiceResponse> => {
    try {
        const response = await Endpoint.get(`published-articles`,{params});
        return {
            status: response.data.status,
            message: response.data.message,
            response: response.data.data
        }
    }
    catch (error) {
        return catchHandling(error);
    }
}
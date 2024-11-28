import { Endpoint } from "../../config/network.config";
import { catchHandling } from "../../utils/errorHandling";
import { ServiceResponse } from "../../utils/interfaces";

export const fetchCategories = async (): Promise<ServiceResponse> => {
    try {
        const response = await Endpoint.get(`getlist`,);
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
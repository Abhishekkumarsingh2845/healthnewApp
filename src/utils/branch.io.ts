import branch, { BranchLinkProperties } from "react-native-branch";
import { ServiceResponse } from "./interfaces";

interface MakeShortParmsType{
    title:string,
    desc:string,
    payload?:any,
    route:string
}
export const generateDynamicLink = async (params:MakeShortParmsType):Promise<ServiceResponse> => {
    try {
        let buo = await branch.createBranchUniversalObject(params.route, {
            title: params.title,
            contentDescription: params.desc,
            contentImageUrl: '',
            contentMetadata:{
                customMetadata: {
                    route:params.route,
                    payload: JSON.stringify(params.payload)
                }
            }
            
        })
        // console.log("buo", JSON.stringify(buo));
        let linkProperties:BranchLinkProperties = {
            feature: 'sharing',
            channel: 'facebook',
            campaign: 'content 123 launch'
        }

        
        let { url } = await buo.generateShortUrl(linkProperties);
        // console.log("url", url);
        return {
            message:'Branch io link is created successfully',
            status:true,
            response:{url},
        }
    } catch (error) {
        // console.log("error--branch io=--->", error);
        return {
            message:`Error: ${error}`,
            status:false,
        };
    }
}
import { useDrawerProgress } from "@react-navigation/drawer";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import  Animated, {   Extrapolation, useAnimatedStyle, interpolate } from "react-native-reanimated";
import { Colors } from "../../config/colors.config";


const Wrapper = (props: any) => {
    const progress = useDrawerProgress();
    
    const viewStyle = useAnimatedStyle(()=>{

        const scale = interpolate(progress.value, 
            [0, 1],
            [1, 0.9],
          );
        
        const borderRadius = interpolate(progress.value, 
            [0, 1],
            [0, 20],
          );
        const borderWidth = interpolate(progress.value, 
            [0, 1],
            [0, 0.6],
          );

        return{
            transform:[{scale:scale}],
            borderRadius:borderRadius,
            borderWidth:borderWidth
        }
    })

    return (
        <>
            <Animated.View style={[{ overflow:'hidden' ,backgroundColor:Colors.primary, borderColor:'rgba(255,255,255,0.5)' }, { flex: 1, }, viewStyle]}  >
                {props.children}
            </Animated.View>
        </>
    )
}
export default Wrapper;



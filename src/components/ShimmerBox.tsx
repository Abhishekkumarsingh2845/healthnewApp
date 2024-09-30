import { View, ViewStyle } from "react-native"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"

interface ShimmerBoxProps {
    style: ViewStyle
};
const ShimmerBox = (props: ShimmerBoxProps) => {
    return (
        <SkeletonPlaceholder borderRadius={4}>
            <View style={props.style} />
        </SkeletonPlaceholder>
    )
}

export default ShimmerBox
import axios from "axios";
import { memo, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, FlatListProps, RefreshControlProps, Text, View } from "react-native"
type DataType = { data: Array<any>, totalPages: number } | null;
interface InfiniteListPropType{
    data:Array<any>,
    totalPages:number,
    onLoad:()=>void,
    ListFooterComponent?:()=>JSX.Element,
    renderItem?:(props:any)=>JSX.Element,
    ListHeaderComponent?:(props:any)=>JSX.Element,
    ListEmptyComponent?:(props:any)=>JSX.Element,
    refreshControl?:React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>> | undefined
    
}
const InfiniteList = ({data,totalPages, onLoad ,renderItem, ListFooterComponent,ListHeaderComponent,ListEmptyComponent,refreshControl}:InfiniteListPropType) => {
    const more = () => {
        onLoad();
    }

    

    return (
        <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            // keyExtractor={item => item.id.toString()}
            refreshControl={refreshControl}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            onEndReached={() => {
                more();
            }}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            ListEmptyComponent={ListEmptyComponent}
        />
    )
}


export default InfiniteList;

const Card = memo((props: any) => {
    return (
        <View style={{
            backgroundColor: 'red', margin: "2%", padding: "3%",
            borderRadius: 10
        }}>
            <Text style={{ color: 'white' }} >Id: {props.id}</Text>
        </View>
    )
});

const getData = async (page: number) => {
    try {
        const data = await axios.get('https://api.themoviedb.org/3/movie/changes', {
            params: { page: page }, headers: {
                "Authorization": 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjEyMDJhOTQ2Mjc5YjI0Nzg1Njc1MjM3MmYwZDQ0YSIsInN1YiI6IjYwODVhZjY3ODQ0NDhlMDA1OWYxZTEzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fO9km2TGbD9mUJC3I7V-7Rgcu9-D1BbRMs0z9-iokPU'
            }
        });
        if (data.status == 200) {
            return {
                data: data.data.results,
                totalPages: data.data.total_pages
            };
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }

}
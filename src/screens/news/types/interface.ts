import { StackScreenProps } from "@react-navigation/stack";
import { ReactNode } from "react";
import { RootStackParamList } from "../../../navigations/MainNavigation/models";
import { NewListType } from "./enum";

export interface NewsPropType extends StackScreenProps<RootStackParamList, 'News'> {
    title: string,
    icon: ReactNode,
    type: NewListType
}

export interface HeaderPropType{
        icon:ReactNode,
        title: string,
} 
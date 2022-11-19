import { Sequelize } from "sequelize";
import { UserProfile } from "../users/types";

export type PackageRestoreData = {
    uid: string;
    db:Sequelize;
}

export type PackageCreateData = {
    sender_uid: string; // ID Отправителя
    recipient_uid: string; // ID Получателя
    info:PackageInfo; // Инфо о самой посылке (Ниже)
    db:Sequelize;
    rating: number;
}

export type PackageInfo = {
    sachet: boolean; // Посылка в покете или без
    fragile: boolean; // Хрупкая посылка
    width: number; // Ширина посылки
    height: number; // Высота посылки
    length: number; // Длинна посылки
    weight: number; // Вес
}

export type GeoPos = {
    longitude: number;
    latitude: number;
}


export type PackageObject = {
    uid: string;
    sender_uid: string;
    recipient_uid: string;
    info: PackageInfo;
    status: PackageStatus;
    rating:number;
}

export interface IPackage extends PackageObject{
    db: Sequelize;
    init(): Promise<boolean>;
}

export type PackageStatus = {
    type:"idle" | "active" | "wait" | "delivered" | "canceled";
    courier_uid: null | string;
}

export type PackageStatusObject = {
    type:"idle" | "active" | "wait" | "delivered" | "canceled";
    courier: null | UserProfile;
}


import { Sequelize } from "sequelize";
import { UserProfile } from "../users/types";

export type PackageRestoreData = {
    uid: string;
    db:Sequelize;
}

export type PackageCreateData = {
    sender_id: string; // ID Отправителя
    recipient_id: string; // ID Получателя
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
}

export type GeoPos = {
    longitude: number;
    latitude: number;
}


export type PackageObject = {
    uid: string;
    sender_id: string;
    recipient_id: string;
    info: PackageInfo;
    status: PackageStatus;
    rating:number;
}

export interface IPackage extends PackageObject{
    db: Sequelize;
    init(): Promise<boolean>;
}

export type PackageStatus = {
    type:"idle" | "active" | "wait" | "delivered";
    courier_id: null | string;
}

export type PackageStatusObject = {
    type:"idle" | "active" | "wait" | "delivered";
    courier: null | UserProfile;
}


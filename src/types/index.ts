export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IUser {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderPost {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderPostResult {
    id: string;
    total: number;
}

export type IFormErrors = Partial<Record<keyof IUser, string>>;


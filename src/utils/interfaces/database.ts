export interface Database {
    public: {
        Tables: {
            Country: {
                Row: {
                    id: string;
                    name: string;
                };
                Insert: {
                    id: string;
                    name: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                };
            };
            Date_Price: {
                Row: {
                    apartment_id: string;
                    date_range: unknown;
                    id: string;
                    price: number;
                };
                Insert: {
                    apartment_id: string;
                    date_range: unknown;
                    id: string;
                    price: number;
                };
                Update: {
                    apartment_id?: string;
                    date_range?: unknown;
                    id?: string;
                    price?: number;
                };
            };
            Guest: {
                Row: {
                    first_name: string;
                    guests_num: number;
                    id: string;
                    last_name: string;
                };
                Insert: {
                    first_name: string;
                    guests_num: number;
                    id: string;
                    last_name: string;
                };
                Update: {
                    first_name?: string;
                    guests_num?: number;
                    id?: string;
                    last_name?: string;
                };
            };
            Person_has_Country: {
                Row: {
                    country_id: string;
                    id: string;
                    person_id: string;
                };
                Insert: {
                    country_id: string;
                    id: string;
                    person_id: string;
                };
                Update: {
                    country_id?: string;
                    id?: string;
                    person_id?: string;
                };
            };
            Profiles: {
                Row: {
                    avatar_url: string | null;
                    created_at: string;
                    email: string;
                    full_name: string;
                    id: string;
                    updated_at: string | null;
                    username: string | null;
                };
                Insert: {
                    avatar_url?: string | null;
                    created_at?: string;
                    email: string;
                    full_name: string;
                    id: string;
                    updated_at?: string | null;
                    username?: string | null;
                };
                Update: {
                    avatar_url?: string | null;
                    created_at?: string;
                    email?: string;
                    full_name?: string;
                    id?: string;
                    updated_at?: string | null;
                    username?: string | null;
                };
            };
            Property: {
                Row: {
                    description: string | null;
                    id: string;
                    image_url: string | null;
                    location: string | null;
                    name: string;
                    rating: number | null;
                    type: string;
                };
                Insert: {
                    description?: string | null;
                    id: string;
                    image_url?: string | null;
                    location?: string | null;
                    name: string;
                    rating?: number | null;
                    type: string;
                };
                Update: {
                    description?: string | null;
                    id?: string;
                    image_url?: string | null;
                    location?: string | null;
                    name?: string;
                    rating?: number | null;
                    type?: string;
                };
            };
            Reservation: {
                Row: {
                    adv_payment_paid: boolean;
                    apartment_id: string;
                    created_at: string;
                    date_range: unknown;
                    fulfilled: boolean;
                    guest_id: string;
                    id: string;
                    note: string;
                    total_price: number;
                    updated_at: string | null;
                };
                Insert: {
                    adv_payment_paid?: boolean;
                    apartment_id: string;
                    created_at?: string;
                    date_range: unknown;
                    fulfilled?: boolean;
                    guest_id: string;
                    id: string;
                    note: string;
                    total_price: number;
                    updated_at?: string | null;
                };
                Update: {
                    adv_payment_paid?: boolean;
                    apartment_id?: string;
                    created_at?: string;
                    date_range?: unknown;
                    fulfilled?: boolean;
                    guest_id?: string;
                    id?: string;
                    note?: string;
                    total_price?: number;
                    updated_at?: string | null;
                };
            };
            Unit: {
                Row: {
                    description: string;
                    id: string;
                    name: string;
                    property_id: string;
                };
                Insert: {
                    description: string;
                    id: string;
                    name: string;
                    property_id: string;
                };
                Update: {
                    description?: string;
                    id?: string;
                    name?: string;
                    property_id?: string;
                };
            };
            User_has_Property: {
                Row: {
                    id: string;
                    property_id: string;
                    user_id: string;
                };
                Insert: {
                    id: string;
                    property_id: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    property_id?: string;
                    user_id?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}

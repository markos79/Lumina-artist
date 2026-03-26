export interface Artwork {
  id: string;
  title: string;
  slug: string;
  artist: string;
  price: number;
  image: string;
  additionalImages?: string[];
  description: string;
  category: string;
  style: string;
  colors: string[];
  width: number;
  height: number;
  medium: string;
  year: number;
  status: 'available' | 'sold' | 'reserved';
  featured: boolean;
  stock: number;
}

export interface CartItem extends Artwork {
  quantity: number;
}

export interface UserPreferences {
  styles: string[];
  colors: string[];
  moods: string[];
  budget: string;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'user';
  preferences?: UserPreferences;
}

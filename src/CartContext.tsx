import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artwork, CartItem, UserData, UserPreferences } from './types';
import { auth, db, onAuthStateChanged, signInWithPopup, googleProvider, signOut, collection, getDocs, doc, setDoc, updateDoc, query, where, onSnapshot, User } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: Artwork[];
  toggleWishlist: (artwork: Artwork) => void;
  isInWishlist: (id: string) => boolean;
  user: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Artwork[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userPath = `users/${currentUser.uid}`;
        
        // Clean up any existing listener before creating a new one
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }

        // Listen to user document changes
        unsubscribeUserDoc = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            console.log('CartContext: User data updated', data);
            setUserData(data);
            setIsAdmin(data.role === 'admin');
          } else {
            console.log('CartContext: User document does not exist, creating...');
            // Create user doc if it doesn't exist
            const role = currentUser.email === 'mkonstadakis@gmail.com' ? 'admin' : 'user';
            const newUser: UserData = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              role
            };
            setDoc(doc(db, 'users', currentUser.uid), newUser).catch(error => {
              handleFirestoreError(error, OperationType.CREATE, userPath);
            });
            setUserData(newUser);
            setIsAdmin(role === 'admin');
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, userPath);
          setLoading(false);
        });
      } else {
        console.log('CartContext: No user authenticated');
        setUserData(null);
        setIsAdmin(false);
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) return;
    const userPath = `users/${user.uid}`;
    try {
      // Use setDoc with merge: true to ensure document exists
      await setDoc(doc(db, 'users', user.uid), { preferences }, { merge: true });
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw handleFirestoreError(error, OperationType.UPDATE, userPath);
    }
  };

  const addToCart = (artwork: Artwork) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === artwork.id);
      if (existing) return prev;
      return [...prev, { ...artwork, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.length;

  const toggleWishlist = (artwork: Artwork) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) return prev.filter(item => item.id !== artwork.id);
      return [...prev, artwork];
    });
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist,
      user, userData, isAdmin, login, logout, updatePreferences, loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

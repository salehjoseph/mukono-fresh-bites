import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'mfb_cart';

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action;
      const existing = state.find((line) => line.id === item.id);
      if (existing) {
        return state.map((line) =>
          line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...state, { id: item.id, name: item.name, price_ugx: item.price_ugx, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((line) => line.id !== action.id);
    case 'INCREASE_QTY':
      return state.map((line) =>
        line.id === action.id ? { ...line, quantity: line.quantity + 1 } : line,
      );
    case 'DECREASE_QTY':
      return state
        .map((line) =>
          line.id === action.id ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((sum, line) => sum + line.price_ugx * line.quantity, 0);
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  const value = {
    items,
    subtotal,
    itemCount,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
    increaseQty: (id) => dispatch({ type: 'INCREASE_QTY', id }),
    decreaseQty: (id) => dispatch({ type: 'DECREASE_QTY', id }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
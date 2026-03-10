/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import type { CartAction, CartState } from "../types/cart";

interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const cartItemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ state, dispatch, cartItemCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCartContext must be used within a CartProvider in the component tree."
    );
  }

  return context;
}

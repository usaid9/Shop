import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i.id === action.payload.id &&
             i.selectedSize === action.payload.selectedSize &&
             i.selectedColor === action.payload.selectedColor
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === existing.id &&
            i.selectedSize === existing.selectedSize &&
            i.selectedColor === existing.selectedColor
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._cartKey !== action.payload) }
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => i._cartKey !== action.payload.key) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i._cartKey === action.payload.key ? { ...i, quantity: action.payload.qty } : i
        ),
      }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

const addCartKey = (item) => ({
  ...item,
  _cartKey: `${item.id}-${item.selectedSize}-${item.selectedColor}`,
})

export function CartProvider({ children }) {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })()

  const [state, dispatch] = useReducer(cartReducer, { items: saved })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product, size, color) => {
    dispatch({ type: 'ADD_ITEM', payload: addCartKey({ ...product, selectedSize: size, selectedColor: color }) })
  }
  const removeItem = (key) => dispatch({ type: 'REMOVE_ITEM', payload: key })
  const updateQty = (key, qty) => dispatch({ type: 'UPDATE_QTY', payload: { key, qty } })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}

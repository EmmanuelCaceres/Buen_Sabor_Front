import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface para un detalle del carrito
interface CartDetail {
  id?: number; // Opcional, puede no existir hasta guardar en BD
  baja?: boolean;
  cantidad: number;
  tipo: 'ARTICULO' | 'PROMOCION';
  articuloId?: number;
  promocionId?: number;
  // Para uso en el frontend, podemos guardar el objeto completo temporalmente
  productData?: any; 
}

// Interface para el estado del carrito
interface CartState {
  detalles: CartDetail[];
  isCartVisible: boolean; // 👈 Nuevo estado
  // Otros campos del pedido que podrías querer guardar
  formaPago: 'EFECTIVO' | 'MERCADO_PAGO';
  tipoEnvio: 'DELIVERY' | 'TAKE_AWAY';
  domicilioId?: number;
  sucursalId?: number;
}

const initialState: CartState = {
  detalles: [],
  isCartVisible: false, // 👈 Valor inicial
  formaPago: 'EFECTIVO',
  tipoEnvio: 'DELIVERY',
};

// Payload para añadir un item
interface AddItemPayload {
  id: number;
  tipo: 'ARTICULO' | 'PROMOCION';
  // Pasamos los datos completos para tenerlos disponibles en el carrito (nombre, precio, etc.)
  productData: any; 
}

// Payload para identificar un item en el carrito
interface ItemIdentifier {
  id: number;
  tipo: 'ARTICULO' | 'PROMOCION';
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Añade un item o incrementa su cantidad
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { id, tipo, productData } = action.payload;
      const existingItem = state.detalles.find(
        item => (item.articuloId === id && item.tipo === 'ARTICULO') || (item.promocionId === id && item.tipo === 'PROMOCION')
      );

      if (existingItem) {
        existingItem.cantidad++;
      } else {
        const newDetail: CartDetail = {
          cantidad: 1,
          tipo: tipo,
          productData: productData,
        };
        if (tipo === 'ARTICULO') {
          newDetail.articuloId = id;
        } else {
          newDetail.promocionId = id;
        }
        state.detalles.push(newDetail);
      }
    },
    // Remueve un item completamente
    removeItem(state, action: PayloadAction<ItemIdentifier>) {
      const { id, tipo } = action.payload;
      state.detalles = state.detalles.filter(
        item => !((item.articuloId === id && tipo === 'ARTICULO') || (item.promocionId === id && tipo === 'PROMOCION'))
      );
    },
    // Decrementa la cantidad de un item, o lo remueve si la cantidad es 1
    decrementQuantity(state, action: PayloadAction<ItemIdentifier>) {
      const { id, tipo } = action.payload;
      const existingItem = state.detalles.find(
        item => (item.articuloId === id && item.tipo === 'ARTICULO') || (item.promocionId === id && item.tipo === 'PROMOCION')
      );

      if (existingItem) {
        if (existingItem.cantidad > 1) {
          existingItem.cantidad--;
        } else {
          // Si la cantidad es 1, filtramos el item para eliminarlo
          state.detalles = state.detalles.filter(
            item => !((item.articuloId === id && tipo === 'ARTICULO') || (item.promocionId === id && tipo === 'PROMOCION'))
          );
        }
      }
    },
    // Limpia el carrito completamente
    clearCart(state) {
      state.detalles = [];
    },
    // Actualiza opciones del pedido
    setOpcionPedido(state, action: PayloadAction<{ formaPago?: 'EFECTIVO' | 'MERCADO_PAGO'; tipoEnvio?: 'DELIVERY' | 'TAKE_AWAY'}>) {
        if(action.payload.formaPago) state.formaPago = action.payload.formaPago;
        if(action.payload.tipoEnvio) state.tipoEnvio = action.payload.tipoEnvio;
    },
    setSucursal(state, action: PayloadAction<number>){
        state.sucursalId = action.payload;
    },
    // 👈 Nueva acción
    toggleCartVisibility(state) {
      state.isCartVisible = !state.isCartVisible;
    }
  },
});

export const { 
    addItem, 
    removeItem, 
    decrementQuantity, 
    clearCart,
    setOpcionPedido,
    setSucursal,
    toggleCartVisibility
} = cartSlice.actions;

export default cartSlice.reducer;
import type {
  CartItem,
  Product,
  SelectedVariant,
  Transaction,
  TransactionItem,
} from "../types";
import { triggerAutoSync } from "./auto-sync";
import { db } from "./db";

export function generateCartItemId(
  productId: string,
  selectedVariants: SelectedVariant[] = [],
  notes = "",
): string {
  const variantKey = selectedVariants
    .map((v) => `${v.group}:${v.label}`)
    .sort()
    .join("|");
  return `${productId}_${variantKey}_${notes.trim()}`;
}

export function calculateCartTotals(cart: CartItem[], taxRate = 0.11) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return { subtotal, tax, total, itemCount };
}

export function addToCart(
  currentCart: CartItem[],
  product: Product,
  selectedVariants: SelectedVariant[] = [],
  notes = "",
): CartItem[] {
  const variantDelta = selectedVariants.reduce((sum, v) => sum + v.delta, 0);
  const unitPrice = product.price + variantDelta;
  const cartItemId = generateCartItemId(product.id, selectedVariants, notes);

  const existingIndex = currentCart.findIndex(
    (item) => item.cartItemId === cartItemId,
  );
  if (existingIndex > -1) {
    const updated = [...currentCart];
    const item = updated[existingIndex];
    // Cap stock if trackStock is true
    const maxQty = item.trackStock ? item.currentStock : 999;
    const newQty = Math.min(item.quantity + 1, maxQty);
    updated[existingIndex] = { ...item, quantity: newQty };
    return updated;
  }

  const newItem: CartItem = {
    cartItemId,
    productId: product.id,
    name: product.name,
    basePrice: product.price,
    price: unitPrice,
    quantity: 1,
    selectedVariants,
    notes: notes.trim() || undefined,
    trackStock: product.trackStock,
    currentStock: product.stock,
  };

  return [...currentCart, newItem];
}

export function updateCartQuantity(
  currentCart: CartItem[],
  cartItemId: string,
  delta: number,
): CartItem[] {
  return currentCart
    .map((item) => {
      if (item.cartItemId === cartItemId) {
        const maxQty = item.trackStock ? item.currentStock : 999;
        const newQty = Math.min(Math.max(0, item.quantity + delta), maxQty);
        return { ...item, quantity: newQty };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);
}

export function removeFromCart(
  currentCart: CartItem[],
  cartItemId: string,
): CartItem[] {
  return currentCart.filter((item) => item.cartItemId !== cartItemId);
}

export function generateInvoiceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `TRX-${dateStr}-${randomSuffix}`;
}

export async function processCheckout(params: {
  cart: CartItem[];
  paymentMethod: "cash" | "transfer" | "qris";
  paymentAmount: number;
}): Promise<Transaction> {
  const { subtotal, tax, total } = calculateCartTotals(params.cart);
  const changeAmount = Math.max(0, params.paymentAmount - total);
  const invoiceNumber = generateInvoiceNumber();
  const id = `trx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const transactionItems: TransactionItem[] = params.cart.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
    selectedVariants:
      item.selectedVariants.length > 0 ? item.selectedVariants : undefined,
    notes: item.notes,
  }));

  const transaction: Transaction = {
    id,
    invoiceNumber,
    subtotal,
    taxAmount: tax,
    discountAmount: 0,
    finalAmount: total,
    paymentMethod: params.paymentMethod,
    paymentAmount: params.paymentAmount,
    changeAmount,
    items: transactionItems,
    status: "completed",
    synced: false,
    createdAt: now,
  };

  // Run in IndexedDB transaction
  await db.transaction(
    "rw",
    [db.transactions, db.products, db.sync_queue],
    async () => {
      await db.transactions.add(transaction);

      // Deduct stock for trackStock === true
      for (const cartItem of params.cart) {
        if (cartItem.trackStock) {
          const prod = await db.products.get(cartItem.productId);
          if (prod?.trackStock) {
            const newStock = Math.max(0, prod.stock - cartItem.quantity);
            await db.products.update(cartItem.productId, {
              stock: newStock,
              updatedAt: now,
            });
          }
        }
      }

      // Push to sync_queue
      await db.sync_queue.add({
        id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        action: "CREATE_TRANSACTION",
        payload: transaction,
        createdAt: now,
      });
    },
  );

  // Optimistic sync trigger
  triggerAutoSync().catch(() => {});

  return transaction;
}

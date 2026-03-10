import { Link } from "react-router-dom";
import { CheckoutForm } from "../../components/CheckoutForm/CheckoutForm";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { state, dispatch, cartTotal } = useCartContext();

  if (state.items.length === 0) {
    return (
      <section className={styles.emptyState} aria-label="Empty shopping cart">
        <h2 className={styles.heading}>Your cart is empty</h2>
        <p className={styles.emptyMessage}>Add products from the catalog to get started.</p>
        <Link to="/" className={styles.browseLink} aria-label="Browse products">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-label="Shopping cart page">
      <h2 className={styles.heading}>Shopping Cart</h2>

      <div className={styles.items}>
        {state.items.map((item) => {
          const lineTotal = item.price * item.quantity;

          return (
            <article key={item.productId} className={styles.item}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.productName}</h3>
                <p className={styles.itemPrice}>${item.price.toFixed(2)} each</p>
              </div>

              <div className={styles.controls}>
                <div className={styles.quantitySelector} aria-label={`Quantity selector for ${item.productName}`}>
                  <button
                    type="button"
                    className={styles.quantityButton}
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: {
                          productId: item.productId,
                          quantity: Math.max(1, Math.min(99, item.quantity - 1)),
                        },
                      })
                    }
                    disabled={item.quantity === 1}
                    aria-label={`Decrease quantity of ${item.productName}`}
                  >
                    −
                  </button>

                  <span className={styles.quantityValue} aria-label={`Current quantity ${item.quantity}`}>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    className={styles.quantityButton}
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: {
                          productId: item.productId,
                          quantity: Math.max(1, Math.min(99, item.quantity + 1)),
                        },
                      })
                    }
                    aria-label={`Increase quantity of ${item.productName}`}
                  >
                    +
                  </button>
                </div>

                <p className={styles.lineTotal} aria-label={`Line total for ${item.productName}`}>
                  ${lineTotal.toFixed(2)}
                </p>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_FROM_CART",
                      payload: { productId: item.productId },
                    })
                  }
                  aria-label={`Remove ${item.productName} from cart`}
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.summary}>
        <p className={styles.totalLabel}>Cart Total</p>
        <p className={styles.totalValue} aria-label={`Cart total is $${cartTotal.toFixed(2)}`}>
          ${cartTotal.toFixed(2)}
        </p>
        <a
          href="#checkout-form"
          className={styles.checkoutButton}
          aria-label="Proceed to checkout section"
        >
          Proceed to Checkout
        </a>
      </div>

      {state.items.length > 0 && <CheckoutForm />}
    </section>
  );
}

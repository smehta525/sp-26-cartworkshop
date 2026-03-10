import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CartBadge.module.css";

export function CartBadge() {
  const { cartItemCount } = useCartContext();
  const navigate = useNavigate();

  const itemLabel =
    cartItemCount === 1
      ? "Open cart with 1 item"
      : `Open cart with ${cartItemCount} items`;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => navigate("/cart")}
      aria-label={itemLabel}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {cartItemCount > 0 && <span className={styles.badge}>{cartItemCount}</span>}
    </button>
  );
}

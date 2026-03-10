import { useEffect, useState } from "react";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./AddToCartButton.module.css";

interface AddToCartProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface AddToCartButtonProps {
  product: AddToCartProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCartContext();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsAdded(false);
    }, 1500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAdded]);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });

    setIsAdded(true);
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleAddToCart}
      aria-label={`Add ${product.name} to cart`}
    >
      {isAdded ? "Added!" : "Add to Cart"}
    </button>
  );
}

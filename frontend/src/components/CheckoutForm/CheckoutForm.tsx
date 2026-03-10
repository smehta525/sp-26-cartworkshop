import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CheckoutForm.module.css";

interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CheckoutFormErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

type CheckoutField = keyof CheckoutFormData;

const initialFormData: CheckoutFormData = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

const checkoutFields: CheckoutField[] = [
  "fullName",
  "email",
  "address",
  "city",
  "state",
  "zipCode",
];

function validateField(
  fieldName: CheckoutField,
  value: string
): string | undefined {
  const trimmedValue = value.trim();

  switch (fieldName) {
    case "fullName":
      if (trimmedValue.length < 2) {
        return "Full name must be at least 2 characters.";
      }
      return undefined;
    case "email":
      if (!trimmedValue.includes("@")) {
        return "Email must contain @.";
      }
      return undefined;
    case "address":
      if (trimmedValue.length < 5) {
        return "Address must be at least 5 characters.";
      }
      return undefined;
    case "city":
      if (trimmedValue.length === 0) {
        return "City is required.";
      }
      return undefined;
    case "state":
      if (trimmedValue.length === 0) {
        return "State is required.";
      }
      return undefined;
    case "zipCode":
      if (!/^\d{5}$/.test(trimmedValue)) {
        return "ZIP code must be exactly 5 digits.";
      }
      return undefined;
  }
}

function validateForm(data: CheckoutFormData): CheckoutFormErrors {
  const nextErrors: CheckoutFormErrors = {};

  for (const field of checkoutFields) {
    const errorMessage = validateField(field, data[field]);
    if (errorMessage) {
      nextErrors[field] = errorMessage;
    }
  }

  return nextErrors;
}

export function CheckoutForm() {
  const { dispatch, cartItemCount, cartTotal } = useCartContext();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFieldBlur = (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const fieldName = event.target.name as CheckoutField;
    const fieldError = validateField(fieldName, formData[fieldName]);

    setTouched((prev) => {
      const nextTouched = new Set(prev);
      nextTouched.add(fieldName);
      return nextTouched;
    });

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setTouched(new Set(checkoutFields));
      return;
    }

    setIsSuccess(false);
    setIsProcessing(true);

    await new Promise<void>((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 900);
    });

    dispatch({ type: "CLEAR_CART" });
    setIsProcessing(false);
    setIsSuccess(true);
    setFormData(initialFormData);
    setErrors({});
    setTouched(new Set());
  };

  const getError = (fieldName: CheckoutField): string | undefined => {
    if (!touched.has(fieldName)) {
      return undefined;
    }

    return errors[fieldName];
  };

  return (
    <section id="checkout-form" className={styles.section} aria-label="Checkout form section">
      <h3 className={styles.heading}>Checkout</h3>
      <p className={styles.summaryText}>
        {cartItemCount} item{cartItemCount === 1 ? "" : "s"} • Total ${cartTotal.toFixed(2)}
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            minLength={2}
            value={formData.fullName}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={styles.input}
            aria-invalid={Boolean(getError("fullName"))}
            aria-describedby={getError("fullName") ? "fullName-error" : undefined}
          />
          {getError("fullName") && (
            <p id="fullName-error" className={styles.error} role="alert">
              {getError("fullName")}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={styles.input}
            aria-invalid={Boolean(getError("email"))}
            aria-describedby={getError("email") ? "email-error" : undefined}
          />
          {getError("email") && (
            <p id="email-error" className={styles.error} role="alert">
              {getError("email")}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="address" className={styles.label}>
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            minLength={5}
            value={formData.address}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={styles.input}
            aria-invalid={Boolean(getError("address"))}
            aria-describedby={getError("address") ? "address-error" : undefined}
          />
          {getError("address") && (
            <p id="address-error" className={styles.error} role="alert">
              {getError("address")}
            </p>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label htmlFor="city" className={styles.label}>
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              className={styles.input}
              aria-invalid={Boolean(getError("city"))}
              aria-describedby={getError("city") ? "city-error" : undefined}
            />
            {getError("city") && (
              <p id="city-error" className={styles.error} role="alert">
                {getError("city")}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="state" className={styles.label}>
              State
            </label>
            <select
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              className={styles.select}
              aria-invalid={Boolean(getError("state"))}
              aria-describedby={getError("state") ? "state-error" : undefined}
            >
              <option value="">Select a state</option>
              <option value="OH">OH</option>
              <option value="CA">CA</option>
              <option value="NY">NY</option>
              <option value="TX">TX</option>
              <option value="FL">FL</option>
            </select>
            {getError("state") && (
              <p id="state-error" className={styles.error} role="alert">
                {getError("state")}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="zipCode" className={styles.label}>
              ZIP Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5}"
              required
              value={formData.zipCode}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              className={styles.input}
              aria-invalid={Boolean(getError("zipCode"))}
              aria-describedby={getError("zipCode") ? "zipCode-error" : undefined}
            />
            {getError("zipCode") && (
              <p id="zipCode-error" className={styles.error} role="alert">
                {getError("zipCode")}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isProcessing || cartItemCount === 0}
          aria-label={isProcessing ? "Processing order" : "Place order"}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </button>

        {isSuccess && (
          <p className={styles.success} role="status" aria-live="polite">
            Order placed successfully. Thank you for shopping with us.
          </p>
        )}
      </form>
    </section>
  );
}

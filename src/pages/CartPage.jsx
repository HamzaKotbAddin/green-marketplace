import './cart-page.css';

const CartPage = ({ cart, setCurrentPage, removeFromCart }) => {
    return (
      <div>
        <h1 className="cart-title">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-grid">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div
                    className="cart-item-image"
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-price">{item.price}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
  
            {/* Proceed to Payment Button */}
            <button
              onClick={() => setCurrentPage('payment')}
              className="checkout-button"
            >
              Proceed to Payment
            </button>
          </>
        )}
  
        {/* Go Back to Products Button */}
        <button
          onClick={() => setCurrentPage('products')}
          className="back-button"
        >
          Back to Products
        </button>
      </div>
    );
  };
  
  export default CartPage;

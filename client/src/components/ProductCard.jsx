import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity, cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const qty = getItemQuantity(product._id);
  const cartItem = cartItems.find((i) => i.productId?._id === product._id);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    addToCart(product._id, 1);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    updateQuantity(cartItem._id, qty + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (qty === 1) removeFromCart(cartItem._id);
    else updateQuantity(cartItem._id, qty - 1);
  };

  return (
    <div className="card p-3 flex flex-col gap-2 hover:scale-[1.01] transition-transform duration-200 animate-fade-in">
      {/* Image + discount badge */}
      <div className="relative">
        {product.discount > 0 && (
          <span className="absolute top-1 left-1 badge-discount z-10">
            {product.discount}% OFF
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-36 object-cover rounded-xl bg-blinkit-gray"
          onError={(e) => {
            e.target.src = `https://placehold.co/200x150/f4f4f4/0C831F?text=${encodeURIComponent(product.name[0] || '?')}`;
          }}
        />
      </div>

      {/* Delivery time */}
      <div className="flex items-center gap-1">
        <Clock size={11} className="text-blinkit-muted" />
        <span className="text-[11px] text-blinkit-muted font-medium">{product.deliveryTime || '10 mins'}</span>
      </div>

      {/* Name + unit */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm text-blinkit-text leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-blinkit-muted mt-0.5">{product.unit}</p>
      </div>

      {/* Price + Add/Qty control */}
      <div className="flex items-center justify-between mt-1">
        <div>
          <span className="font-bold text-blinkit-text text-sm">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-blinkit-muted line-through ml-1.5">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {qty === 0 ? (
          <button onClick={handleAdd} className="add-btn">ADD</button>
        ) : (
          <div className="flex items-center bg-blinkit-green rounded-lg overflow-hidden">
            <button onClick={handleDecrease}
              className="w-8 h-8 text-white font-bold text-lg flex items-center justify-center hover:bg-blinkit-green-dark transition-colors">
              −
            </button>
            <span className="text-white font-bold text-sm w-6 text-center">{qty}</span>
            <button onClick={handleIncrease}
              className="w-8 h-8 text-white font-bold text-lg flex items-center justify-center hover:bg-blinkit-green-dark transition-colors">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

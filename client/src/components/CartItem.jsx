import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.productId;

  if (!product) return null;

  const handleIncrease = () => updateQuantity(item._id, item.quantity + 1);
  const handleDecrease = () => {
    if (item.quantity === 1) removeFromCart(item._id);
    else updateQuantity(item._id, item.quantity - 1);
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card animate-fade-in">
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-xl bg-blinkit-gray shrink-0"
        onError={(e) => {
          e.target.src = `https://placehold.co/80x80/f4f4f4/0C831F?text=${encodeURIComponent(product.name[0])}`;
        }}
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-blinkit-text leading-tight">{product.name}</h3>
        <p className="text-xs text-blinkit-muted mt-0.5">{product.unit}</p>
        <p className="font-bold text-blinkit-green mt-1">₹{product.price}</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 bg-blinkit-green rounded-lg overflow-hidden">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg
            hover:bg-blinkit-green-dark transition-colors"
        >
          −
        </button>
        <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg
            hover:bg-blinkit-green-dark transition-colors"
        >
          +
        </button>
      </div>

      {/* Item total + remove */}
      <div className="text-right shrink-0">
        <p className="font-bold text-sm text-blinkit-text">
          ₹{(product.price * item.quantity).toFixed(0)}
        </p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="text-red-400 hover:text-red-600 transition-colors mt-1"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

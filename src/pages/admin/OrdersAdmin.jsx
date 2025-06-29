import { useEffect, useState } from "react";
import axios from "axios";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/ordersAdmin");
      setOrders(res.data);
    } catch (err) {
      console.error("Gagal fetch semua orders:", err);
    }
  };

  const handleShip = async (orderId) => {
    try {
      await axios.put(`http://localhost:3001/api/orders/${orderId}/ship`);
      fetchOrders();
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  const formatOrderNumber = (order) => {
    const date = new Date(order.created_at);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `#${y}${m}${order.id}`;
  };

  const getStatusButtonClass = (status) => {
    switch (status) {
      case 'completed': return 'btn-success';
      case 'packaging': return 'btn-primary';
      case 'shipped': return 'btn-warning';
      case 'cancelled': return 'btn-danger';
      default: return 'btn-secondary';
    }
  };

  return (
    <div className="container mt-4">
        <div className="d-flex align-items-center">
            <button 
            className="btn btn-link p-0 me-3" 
            onClick={() => window.location.href = '/admin'}>
            <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <h3>Pesanan Pelanggan</h3>
      </div>
      {orders.map(order => (
        <div key={order.id} className="card mb-3 shadow-sm p-3 bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5>ID Order: {formatOrderNumber(order)}</h5>
            <button className={`btn ${getStatusButtonClass(order.status)} btn-sm text-capitalize`}>
              {order.status}
            </button>
          </div>
          <p><strong>Username:</strong> {order.user.username}</p>
          <p><strong>Total Harga:</strong> Rp {parseFloat(order.total_price).toLocaleString()}</p>
          <p><strong>Metode Pembayaran:</strong> {order.payment_method}</p>
          <div>
            <strong>Produk:</strong>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  <img
                    src={`/src/assets/${item.product.image_url}`}
                    alt={item.product.name}
                    style={{ width: '50px', marginRight: '10px' }}
                  />
                  {item.product.name} - Qty: {item.quantity} - Rp {parseFloat(item.price).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
          {order.status === "packaging" && (
            <button
              className="btn btn-primary mt-2"
              onClick={() => handleShip(order.id)}
            >
              Tandai Sudah Dikirim
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersAdmin;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Produk = () => {
  const [produkList, setProdukList] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/products');
      setProdukList(res.data);
    } catch (err) {
      console.error('Gagal mengambil produk:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
            <button 
            className="btn btn-link p-0 me-3" 
            onClick={() => window.location.href = '/admin'}>
            <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <h2 className="mb-0">Kelola Produk</h2>
        </div>
        <Link to="/admin/produk/AddProduct" className="btn btn-primary">
            Tambah Produk
        </Link>
        </div>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>No</th>
            <th>Gambar</th>
            <th>Kategori</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(produkList) && produkList.length > 0 ? (
            produkList.map((produk, index) => (
              <tr key={produk.id}>
                <td>{index+1}</td>
                <td>
                  <img
                    src={`../src/assets/${produk.image_url}`}
                    alt={produk.name}
                    style={{ width: '80px', height: 'auto' }}
                  />
                </td>
                <td>{produk.category_name || '-'}</td>
                <td>{produk.name}</td>
                <td>Rp {parseFloat(produk.price).toLocaleString()}</td>
                <td>{produk.description}</td>
                <td>
                  <Link to={`/admin/produk/EditProduct/${produk.id}`} className="btn btn-sm btn-warning me-2">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(produk.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Tidak ada produk.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Produk;

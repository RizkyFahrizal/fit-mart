import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));

      await axios.post('http://localhost:3001/api/products', data);
      navigate('/admin/produk');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container my-4">
      <h2>Tambah Produk</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama Produk</label>
          <input
            type="text"
            name="name"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Harga</label>
          <input
            type="number"
            name="price"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Deskripsi</label>
          <textarea
            name="description"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Gambar</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Kategori</label>
          <select
            name="category_id"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-success" type="submit">Simpan</button>
      </form>
    </div>
  );
};

export default AddProduct;

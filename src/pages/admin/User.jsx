import { useEffect, useState } from 'react';
import axios from 'axios';

function User() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    contact_no: '',
    role: 'admin',
  });
  const [editing, setEditing] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users', newUser);
      setNewUser({
        username: '',
        email: '',
        password: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        contact_no: '',
        role: 'admin',
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, username) => {
    if (username === 'admin') {
      alert('User "admin" tidak bisa dihapus!');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus user ${username}?`)) {
      try {
        await axios.delete(`http://localhost:3001/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditing({ ...user });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/users/${editing.id}`, {
        ...editing,
        role: 'admin', // tetap admin
      });
      setEditing(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditing({ ...editing, [name]: value });
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link p-0 me-3" onClick={() => window.location.href = '/admin'}>
          <i className="bi bi-arrow-left fs-4"></i>
        </button>
        <h2>Kelola User</h2>
      </div>

      <form onSubmit={handleAddUser} className="mb-4">
        <div className="row g-2">
          {['username', 'email', 'password', 'date_of_birth', 'address', 'city', 'contact_no'].map((field, i) => (
            <div key={i} className="col-md-3">
              <input
                type={field === 'date_of_birth' ? 'date' : field === 'password' ? 'password' : 'text'}
                name={field}
                className="form-control"
                placeholder={field.replace('_', ' ')}
                value={newUser[field]}
                onChange={handleInputChange}
                required={field !== 'contact_no'}
              />
            </div>
          ))}
          <div className="col-md-2">
            <select name="gender" className="form-select" value={newUser.gender} onChange={handleInputChange} required>
              <option value="">Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100" type="submit">Tambah</button>
          </div>
        </div>
      </form>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Email</th>
            <th>Tanggal Lahir</th>
            <th>Gender</th>
            <th>Alamat</th>
            <th>Kota</th>
            <th>Kontak</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id}>
              <td>{index + 1}</td>
              {['username', 'email', 'date_of_birth', 'gender', 'address', 'city', 'contact_no', 'role'].map((field) => (
                <td key={field}>
                  {editing?.id === u.id ? (
                    field === 'role' ? (
                        <span>{editing[field]}</span> // tidak bisa diubah
                    ) : field === 'gender' ? (
                        <select
                        name={field}
                        className="form-select"
                        value={editing[field]}
                        onChange={handleEditInputChange}
                        >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                        </select>
                    ) : field === 'date_of_birth' ? (
                        <input
                        className="form-control"
                        type="date"
                        name={field}
                        value={editing[field]?.slice(0, 10)}
                        onChange={handleEditInputChange}
                        />
                    ) : (
                        <input
                        className="form-control"
                        name={field}
                        value={editing[field]}
                        onChange={handleEditInputChange}
                        />
                    )
                    ) : (
                    field === 'date_of_birth' ? (
                        <span>{u[field]?.slice(0, 10)}</span>
                    ) : (
                        <span>{u[field]}</span>
                    )
                    )}
                </td>
              ))}
              <td>
                {editing?.id === u.id ? (
                    <>
                    <button className="btn btn-sm btn-primary me-2" onClick={handleUpdate}>Simpan</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditing(null)}>Batal</button>
                    </>
                ) : (
                    <>
                    {u.username !== 'admin' ? (
                        <>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(u)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id, u.username)}>Hapus</button>
                        </>
                    ) : (
                        <span></span>
                    )}
                    </>
                )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default User;

import { Link } from 'react-router-dom';

function Admin({ user }) {
    console.log(user);
    if (!user || user.role !== 'admin') {
        return <div className="text-center mt-5">Akses ditolak. Anda bukan admin.</div>;
      }
  return (
    <>
      {/* Menu Admin */}
      <div className="container mt-4">
        <h3 className="mb-4">Dashboard Admin</h3>
        <div className="row g-4">
            <div className="col-md-3">
                <Link to="/admin/kategori" className="text-decoration-none">
                <div className="card text-center p-4 shadow-sm h-100">
                    <i className="bi bi-tags fs-1 text-primary"></i>
                    <h5 className="mt-3 text-dark">Kelola Kategori</h5>
                </div>
                </Link>
            </div>

            <div className="col-md-3">
                <Link to="/admin/produk" className="text-decoration-none">
                <div className="card text-center p-4 shadow-sm h-100">
                    <i className="bi bi-box-seam fs-1 text-primary"></i>
                    <h5 className="mt-3 text-dark">Kelola Produk</h5>
                </div>
                </Link>
            </div>

            <div className="col-md-3">
                <Link to="/admin/adminguestbook" className="text-decoration-none">
                <div className="card text-center p-4 shadow-sm h-100">
                    <i className="bi bi-journal-text fs-1 text-primary"></i>
                    <h5 className="mt-3 text-dark">Guest Book</h5>
                </div>
                </Link>
            </div>

            <div className="col-md-3">
                <Link to="/admin/user" className="text-decoration-none">
                <div className="card text-center p-4 shadow-sm h-100">
                    <i className="bi bi-people fs-1 text-primary"></i>
                    <h5 className="mt-3 text-dark">Kelola User</h5>
                </div>
                </Link>
            </div>

            <div className="col-md-3">
                <Link to="/admin/ordersadmin" className="text-decoration-none">
                <div className="card text-center p-4 shadow-sm h-100">
                    <i className="bi bi-person-check fs-1 text-primary"></i>
                    <h5 className="mt-3 text-dark">Customer Order</h5>
                </div>
                </Link>
            </div>
        </div>
      </div>
    </>
  );
}

export default Admin;

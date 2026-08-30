import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null); // Trạng thái lưu ID sinh viên đang sửa

  const API_URL = 'http://localhost:5000/api/students';

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (res.ok) setStudents(data);
    } catch (err) {
      console.error("Lỗi fetch danh sách:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý Thêm hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editingId);
    const url = isEdit ? `${API_URL}/${editingId}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(isEdit ? 'Cập nhật thành công!' : 'Thêm sinh viên thành công!');
        setFormData({ studentId: '', name: '', email: '' });
        setEditingId(null);
        fetchStudents();
      } else {
        alert('Lỗi: ' + (data.message || 'Thao tác thất bại'));
      }
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
    }
  };

  // Đưa dữ liệu sinh viên lên form để sửa (Câu 77)
  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  // Hủy chế độ sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '' });
  };

  // Xóa sinh viên (Câu 78)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Xóa sinh viên thành công!');
        fetchStudents();
      } else {
        const data = await res.json();
        alert('Lỗi: ' + (data.message || 'Không thể xóa'));
      }
    } catch (err) {
      console.error("Lỗi xóa sinh viên:", err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '650px', margin: 'auto', fontFamily: 'sans-serif' }}>
    <h2>Quản Lý Sinh Viên - Version 2.0 (athn685)</h2>      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Mã số sinh viên (studentId)"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            style={{ 
              flex: 1, 
              padding: '10px', 
              background: editingId ? '#28a745' : '#007bff', 
              color: '#fff', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancelEdit}
              style={{ padding: '10px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Hủy Sửa
            </button>
          )}
        </div>
      </form>

      <h3>Danh Sách Sinh Viên</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((s) => (
          <li 
            key={s._id || s.studentId}
            style={{ 
              display: 'flex', 
              justify: 'space-between', 
              alignItems: 'center', 
              padding: '10px 0', 
              borderBottom: '1px solid #ddd' 
            }}
          >
            <span>{s.studentId} - {s.name} - {s.email}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleEdit(s)}
                style={{ background: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                Sửa
              </button>
              <button 
                onClick={() => handleDelete(s._id)}
                style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
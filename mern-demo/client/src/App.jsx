import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const [editingId, setEditingId] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/students`;

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (res.ok) {
        setStudents(data);
      } else {
        console.error('Lỗi lấy danh sách sinh viên:', data.message);
      }
    } catch (err) {
      console.error('Lỗi fetch danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEdit = Boolean(editingId);
    const url = isEdit ? `${API_URL}/${editingId}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          isEdit
            ? 'Cập nhật thành công!'
            : 'Thêm sinh viên thành công!'
        );

        setFormData({
          studentId: '',
          name: '',
          email: ''
        });

        setEditingId(null);
        await fetchStudents();
      } else {
        alert('Lỗi: ' + (data.message || 'Thao tác thất bại'));
      }
    } catch (err) {
      console.error('Lỗi gửi dữ liệu:', err);
      alert('Không thể kết nối đến máy chủ!');
    }
  };

  // Đưa dữ liệu sinh viên lên form để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Hủy chế độ sửa
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      studentId: '',
      name: '',
      email: ''
    });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (!id) {
      alert('Không tìm thấy ID sinh viên!');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        alert('Xóa sinh viên thành công!');

        if (editingId === id) {
          handleCancelEdit();
        }

        await fetchStudents();
      } else {
        alert('Lỗi: ' + (data.message || 'Không thể xóa'));
      }
    } catch (err) {
      console.error('Lỗi xóa sinh viên:', err);
      alert('Không thể kết nối đến máy chủ!');
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '650px',
        margin: 'auto',
        fontFamily: 'sans-serif'
      }}
    >
      <h2>Quản Lý Sinh Viên - Version 2.0 (athn685)</h2>

      {/* Form thêm hoặc cập nhật sinh viên */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <input
          type="text"
          placeholder="Mã số sinh viên (studentId)"
          value={formData.studentId}
          onChange={(e) =>
            setFormData({
              ...formData,
              studentId: e.target.value
            })
          }
          required
        />

        <input
          type="text"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
          required
        />

        <div
          style={{
            display: 'flex',
            gap: '10px'
          }}
        >
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
              style={{
                padding: '10px',
                background: '#6c757d',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Hủy Sửa
            </button>
          )}
        </div>
      </form>

      {/* Danh sách sinh viên */}
      <h3>Danh Sách Sinh Viên</h3>

      <ul
        style={{
          listStyle: 'none',
          padding: 0
        }}
      >
        {students.map((s) => (
          <li
            key={s._id || s.studentId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
              borderBottom: '1px solid #ddd'
            }}
          >
            <span>
              {s.studentId} - {s.name} - {s.email}
            </span>

            <div
              style={{
                display: 'flex',
                gap: '8px'
              }}
            >
              <button
                type="button"
                onClick={() => handleEdit(s)}
                style={{
                  background: '#ffc107',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Sửa
              </button>

              <button
                type="button"
                onClick={() => handleDelete(s._id)}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Thông tin phiên bản ở cuối giao diện */}
      <p
        style={{
          textAlign: 'center',
          marginTop: 24,
          opacity: 0.7
        }}
      >
        Phiên bản 2.0 - Production Cloud PaaS (Auto-Deployed)
      </p>
    </div>
  );
}

export default App;
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const App = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const initialUserState = { name: '', lastname: '', phone: '' };
  const [newUser, setNewUser] = useState(initialUserState);
  const [error, setError] = useState({ name: '', lastname: '' });

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle update
  const handleUpdate = (user) => {
    setSelectedUser(user);
    setIsAdding(false);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      console.log(`Eliminando usuario con ID: ${id}`);
      fetchData();
    }
  };

  // Validate user input
  const validateUserInput = () => {
    let valid = true;
    let errors = { name: '', lastname: '' };

    // Check name
    if (!newUser.name || /\d/.test(newUser.name)) {
      errors.name = 'El nombre no puede estar vacío y no debe contener números.';
      valid = false;
    }

    // Check lastname
    if (!newUser.lastname || /\d/.test(newUser.lastname)) {
      errors.lastname = 'El apellido no puede estar vacío y no debe contener números.';
      valid = false;
    }

    setError(errors);
    return valid;
  };

  // Handle modal save for add
  const handleSaveAdd = async () => {
    if (!validateUserInput()) return;

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        console.log('Usuario añadido:', newUser);
        fetchData();
      }
    } catch (error) {
      console.error('Error añadiendo usuario:', error);
    } finally {
      setShowModal(false);
      setNewUser(initialUserState);
      setError({ name: '', lastname: '' });
    }
  };

  // Handle modal save for update
  const handleSaveUpdate = () => {
    console.log('Actualizando usuario:', selectedUser);
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="container mt-5">
      <h2>Lista de Usuarios</h2>
      <Button variant="success" onClick={() => { setIsAdding(true); setShowModal(true); }} className="mb-3">
        <i className="fas fa-plus icon"></i> Agregar Registro
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.lastname}</td>
              <td>{user.phone}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdate(user)}>
                  <i className="fas fa-edit icon"></i> Actualizar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  <i className="fas fa-trash icon"></i> Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar/actualizar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isAdding ? 'Agregar Usuario' : 'Actualizar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAdding ? (
            <div>
              <div className="mb-3">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                {error.name && <small className="text-danger">{error.name}</small>}
              </div>
              <div className="mb-3">
                <label>Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.lastname}
                  onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                />
                {error.lastname && <small className="text-danger">{error.lastname}</small>}
              </div>
              <div className="mb-3">
                <label>Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
            </div>
          ) : (
            selectedUser && (
              <div>
                <div className="mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label>Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedUser.lastname}
                    onChange={(e) => setSelectedUser({ ...selectedUser, lastname: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedUser.phone}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  />
                </div>
              </div>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={isAdding ? handleSaveAdd : handleSaveUpdate}>
            {isAdding ? 'Agregar Usuario' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;

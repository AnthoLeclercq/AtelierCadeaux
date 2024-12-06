import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalAdd from '../../components/Modals/Products/ModalAdd';
import ModalEdit from '../../components/Modals/Products/ModalEdit';
import ModalDelete from '../../components/Modals/Products/ModalDelete';
import ModalView from '../../components/Modals/Products/ModalView';
import Header from '../../components/Header/Header';
import Navbar from '../../components/NavBar/NavBar';
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = 'http://localhost:3000/product'; 
        const response = await axios.get(apiUrl);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message || 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalType('view');
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalType('edit');
  };

  const handleDeleteProduct = (product) => {
    if (product) {
      setSelectedProduct(product);
      setModalType('delete');
    }
  };

  const handleAddProduct = () => {
    setModalType('add');
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalType(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="products-container">
      <Header />
      <main className="main">
        <Navbar />
        <div className="content">
          <div className="products_header">
            <h2>Products</h2>
            <button className="btn_add" onClick={handleAddProduct}>Ajouter un produit</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Artisan ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.artisan_id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.sub_category}</td>
                  <td>
                    <button className="btn_see" onClick={() => handleViewProduct(product)}>Voir</button>
                    <button className="btn_edit" onClick={() => handleEditProduct(product)}>Éditer</button>
                    <button className="btn_del" onClick={() => handleDeleteProduct(product)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedProduct && modalType === 'view' && (
            <ModalView show={!!modalType} handleClose={handleCloseModal} product={selectedProduct} />
          )}

          {selectedProduct && modalType === 'delete' && (
            <ModalDelete
              show={!!modalType}
              handleClose={handleCloseModal}
              handleDeleteProduct={handleDeleteProduct}
              product={selectedProduct}
            />
          )}

          {selectedProduct && modalType === 'edit' && (
            <ModalEdit
              show={!!modalType}
              handleClose={handleCloseModal}
              handleEditProduct={handleEditProduct}
              product={selectedProduct}
            />
          )}

          {modalType === 'add' && (
            <ModalAdd show={!!modalType} handleClose={handleCloseModal} handleAddProduct={handleAddProduct} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;

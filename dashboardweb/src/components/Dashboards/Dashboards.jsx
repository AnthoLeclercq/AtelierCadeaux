import React from 'react';
import './Dashboards.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Produit 1', value: 400 },
  { name: 'Produit 2', value: 300 },
  { name: 'Produit 3', value: 200 },
  { name: 'Produit 4', value: 500 },
];

function Dashboards() {
  return (
    <div className="row mt-3">
      <div className="col-md-4 py-2">
        <div className="card bg-users text-white h-100">
          <div className="card-body bg-users">
            <div className="rotate">
              <i className="fa fa-user fa-4x"></i>
            </div>
            <h6 className="text-uppercase">Utilisateurs</h6>
            <h1 className="display-4">134</h1>
          </div>
        </div>
      </div>
      <div className="col-md-4 py-2">
        <div className="card text-white bg-posts h-100">
          <div className="card-body bg-posts">
            <div className="rotate">
              <i className="fa fa-list fa-4x"></i>
            </div>
            <h6 className="text-uppercase">Produits</h6>
            <h1 className="display-4">87</h1>
          </div>
        </div>
      </div>
      <div className="col-md-4 py-2">
        <div className="card text-white bg-posts h-100">
          <div className="card-body bg-posts">
            <div className="rotate">
              <i className="fa fa-list fa-4x"></i>
            </div>
            <h6 className="text-uppercase">Commandes</h6>
            <h1 className="display-4">123</h1>
          </div>
        </div>
      </div>
      <div className="col-md-12 py-2">
      <div className="chart-container">
        <BarChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#B0CDB9" />
        </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Dashboards;

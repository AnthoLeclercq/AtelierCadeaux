const mysql = require('mysql2');
const client = require('./elasticsearchConfigHelper.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectToDatabase = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    return connection;
};

const queryAsync = (connection, query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
};

const indexData = async () => {
    let connection;
    try {
        connection = await connectToDatabase();

        const productsQuery = 'SELECT product_id, name, description, price, images_product FROM products';
        const products = await queryAsync(connection, productsQuery);

        for (const product of products) {
            await client.index({
                index: 'products',
                id: product.product_id.toString(),
                body: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    images_product: product.images_product
                }
            });
        }
        console.log('Products indexed successfully');

        const productMetaQuery = 'SELECT product_meta_id, product_id, meta_id, meta_value FROM product_meta';
        const productMetas = await queryAsync(connection, productMetaQuery);

        for (const meta of productMetas) {
            await client.index({
                index: 'product_meta',
                id: meta.product_meta_id.toString(),
                body: {
                    product_id: meta.product_id,
                    meta_id: meta.meta_id,
                    meta_value: meta.meta_value
                }
            });
        }
        console.log('Product metas indexed successfully');

        const usersQuery = 'SELECT user_id, name, email, role FROM users WHERE role = "artisan"';
        const users = await queryAsync(connection, usersQuery);

        for (const user of users) {
            await client.index({
                index: 'users',
                id: user.user_id.toString(),
                body: {
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        console.log('Users indexed successfully');

    } catch (error) {
        console.error('Error indexing data:', error);
    } finally {
        if (connection) {
            connection.end();
        }
    }
};

module.exports = {
    indexData
};

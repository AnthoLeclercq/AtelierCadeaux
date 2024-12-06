const db = require("../helpers/database");

const Meta = function (meta) {
    this.meta_id = meta.meta_id;
    this.meta_key = meta.meta_key;
    this.meta_values = meta.meta_values;
};

Meta.getAllMetasExceptSubcategories = result => {
    const selectQuery = `
        SELECT meta_id, meta_key, meta_values
        FROM meta
        WHERE meta_key NOT LIKE 'sous_categorie_%'
    `;

    db.query(selectQuery, (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.length === 0) {
            return result(null, { status: 404, msg: "No meta data found except subcategories" });
        }
        result(null, {
            status: 200,
            msg: "Get all meta data except subcategories with success!",
            data: res,
        });
    });
};

Meta.getSubcategoriesByCategory = (category, result) => {
    const selectQuery = `
        SELECT meta_id, meta_values
        FROM meta 
        WHERE meta_key = ?
    `;
    const subcategoryKey = `sous_categorie_${category.toLowerCase()}`;

    db.query(selectQuery, [subcategoryKey], (err, res) => {
        if (err) {
            return result({ status: 500, msg: err });
        }
        if (res.length === 0) {
            return result(null, { status: 404, msg: `No subcategories found for category ${category}` });
        }

        try {
            let subcategories = res[0].meta_values;
            if (typeof subcategories === 'string') {
                subcategories = JSON.parse(subcategories);
            }

            if (!Array.isArray(subcategories)) {
                throw new Error('Invalid subcategories format');
            }

            // Créer l'objet de réponse avec meta_id et les sous-catégories
            const response = {
                meta_id: res[0].meta_id,
                subcategories: subcategories
            };

            result(null, {
                status: 200,
                msg: `Get subcategories for category ${category} with success!`,
                data: response,
            });
        } catch (error) {
            console.error(`Failed to parse JSON for ${subcategoryKey}:`, error);
            result({ status: 500, msg: `Failed to parse JSON for ${subcategoryKey}: ${error.message}` });
        }
    });
};

module.exports = Meta;

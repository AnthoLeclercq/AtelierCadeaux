const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const enumDatas = {
    'categories': [
        "Meubles",
        "Vêtements",
        "Chaussures",
        "Accessoires",
        "Bijoux",
        "Art",
        "Décoration",
        "Produits alimentaires",
        "Jardinage et extérieur",
        "Evasion",
        "Loisirs créatifs",
        "Mode Éthique",
        "Autres"
    ],
    'sous_categorie_meubles': [
        "Table",
        "Chaise",
        "Armoire",
        "Étagère",
        "Canapé",
        "Lit",
        "Bureau",
        "Commode",
        "Bibliothèque",
        "Buffet",
        "Tabouret",
        "Meuble TV",
        "Console",
        "Porte-manteau",
        "Vaisselier",
        "Paravent",
        "Autres"
    ],
    'sous_categorie_vetements': [
        "T-shirt",
        "Short",
        "Jupe",
        "Robe",
        "Pantalon",
        "Pull",
        "Veste",
        "Jogging",
        "Blazer",
        "Costume",
        "Chemise",
        "Pyjama",
        "Sweat-shirt",
        "Gilet",
        "Legging",
        "Cardigan",
        "Manteau",
        "Ensemble",
        "Bermuda",
        "Chemisette",
        "Autres"
    ],
    'sous_categorie_chaussures': [
        "Basket",
        "Ballerine",
        "Randonnée",
        "Course à pied",
        "Talon aiguilles",
        "Compensée",
        "Sandale",
        "Claquette",
        "Tong",
        "Bottine",
        "Bottes",
        "Mocassin",
        "Derbies",
        "Espadrille",
        "Chausson",
        "Loafer",
        "Autres"
    ],
    'sous_categorie_accessoires': [
        "Sac à main",
        "Écharpe",
        "Casquette",
        "Lunettes",
        "Ceinture",
        "Gants",
        "Chapeau",
        "Montre",
        "Parapluie",
        "Bijou de tête",
        "Porte-clés",
        "Pochette",
        "Sac à dos",
        "Éventail",
        "Bandana",
        "Autres"
    ],
    'sous_categorie_bijoux': [
        "Collier",
        "Bracelet",
        "Bague",
        "Montre",
        "Alliance",
        "Boucles d'oreilles",
        "Piercing",
        "Broche",
        "Médaillon",
        "Chaîne",
        "Cufflinks",
        "Bracelet de cheville",
        "Dentelle",
        "Autres"
    ],
    'sous_categorie_art': [
        "Peinture",
        "Sculpture",
        "Photographie",
        "Dessin",
        "Gravure",
        "Céramique",
        "Artisanat",
        "Textile",
        "Art mural",
        "Art numérique",
        "Autres"
    ],
    'sous_categorie_decoration': [
        "Tableau",
        "Tapis",
        "Rideaux",
        "Luminaires",
        "Coussin",
        "Miroir",
        "Décorations murales",
        "Bougies",
        "Plantes",
        "Vases",
        "Autres"
    ],
    'sous_categorie_produits_alimentaires': [
        "Épicerie",
        "Boissons",
        "Confiseries",
        "Sauces",
        "Épices",
        "Conserve",
        "Produits de boulangerie",
        "Fromages",
        "Viandes",
        "Fruits et légumes",
        "Autres"
    ],
    'sous_categorie_jardinage_et_exterieur': [
        "Plantes",
        "Pots",
        "Terreau",
        "Outils de jardinage",
        "Meubles d'extérieur",
        "Décorations de jardin",
        "Éclairage extérieur",
        "Graines",
        "Compost",
        "Autres"
    ],
    'sous_categorie_evasion': [
        "Produits de beauté",
        "Bougies parfumées",
        "Aromathérapie",
        "Accessoires de relaxation",
        "Thé et infusions",
        "Équipements de massage",
        "Cosmétiques naturels",
        "Produits de bain",
        "Huiles essentielles",
        "Autres"
    ],
    'sous_categorie_loisirs_creatifs': [
        "Kit de peinture",
        "Création de bougies",
        "Macramé",
        "Perles et accessoires pour bijoux",
        "Tricot et crochet",
        "Scrapbooking",
        "Décoration en papier",
        "Couture",
        "Modelage et sculpture",
        "Peinture sur toile",
        "Autres"
    ],
    'sous_categorie_mode_ethique': [
        "Vêtements en matières écologiques",
        "Accessoires en matériaux durables",
        "Bijoux éthiques",
        "Mode upcyclée",
        "Chaussures éco-responsables",
        "Sacs et maroquinerie éthique",
        "Tenues de sport écologiques",
        "Articles pour bébés et enfants éthiques",
        "Autres"
    ],
    'materiaux': [
        "Bois",
        "Métal",
        "Plastique",
        "Tissu",
        "Cuir",
        "Verre",
        "Céramique",
        "Pierre",
        "Marbre",
        "Acier inoxydable",
        "Aluminium",
        "Laine",
        "Polyester",
        "Bambou",
        "Cuivre",
        "Argent",
        "Or",
        "Lin",
        "Rattan",
        "Jute",
        "Autres"
    ],
    'couleurs': [
        "Bleu",
        "Vert",
        "Noir",
        "Blanc",
        "Rouge",
        "Jaune",
        "Orange",
        "Rose",
        "Violet",
        "Gris",
        "Marron",
        "Beige",
        "Turquoise",
        "Indigo",
        "Magenta",
        "Bordeaux",
        "Crème",
        "Olive",
        "Doré",
        "Bronze",
        "Argenté",
        "Autres"
    ]
};


async function connectToDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    return connection;
}

async function clearMetaTable() {
    const connection = await connectToDatabase();

    try {
        await connection.query("DELETE FROM meta");
        console.log("Table 'meta' cleared successfully.");
    } catch (error) {
        console.error("Failed to clear table 'meta': ", error);
    } finally {
        connection.end();
    }
}

async function insertEnumValuesInMetaTable(enumDatas) {
    const connection = await connectToDatabase();

    try {
        const valuesToInsert = Object.entries(enumDatas).map(([key, value]) => {
            const metaValues = Array.isArray(value) ? JSON.stringify(value) : value;
            return [key, metaValues];
        });

        await connection.query("INSERT INTO meta (meta_key, meta_values) VALUES ?", [valuesToInsert]);

        console.log("Enum values inserted in table 'meta' with success!");
    } catch (error) {
        console.error("Failed to insert data in table 'meta': ", error);
    } finally {
        connection.end();
    }
}

const insertEnumValues = async () => {
    await clearMetaTable();
    await insertEnumValuesInMetaTable(enumDatas);
};

module.exports = {
    insertEnumValues
};

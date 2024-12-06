const db = require("../helpers/database.js");
const { getCurrentTimeInFrance } = require("../helpers/datetimeHelper.js");

// Constructeur pour Discussion
const Discussion = function (discussion) {
  this.client_id = discussion.client_id;
  this.artisan_id = discussion.artisan_id;
  this.messages = discussion.messages;
};

/************ Créer et enregistrer une nouvelle discussion ***********************/
Discussion.create = (newDiscussion, result) => {
  const messagesArray = newDiscussion.messages.map(msg => ({
    text: msg.text,
    user_id: msg.user_id,
    time: getCurrentTimeInFrance()
  }));

  const insertQuery = `INSERT INTO discussions (client_id, artisan_id, messages) VALUES (?, ?, ?)`;
  const values = [
    newDiscussion.client_id,
    newDiscussion.artisan_id,
    JSON.stringify(messagesArray) // Convertir les messages en JSON
  ];

  db.query(insertQuery, values, (err, res) => {
    if (err) {
      return result(err, { status: 400, msg: "Error creating discussion" });
    }

    // Construction de la réponse avec l'heure actuelle
    const createdDiscussion = {
      discussion_id: res.insertId,
      client_id: newDiscussion.client_id,
      artisan_id: newDiscussion.artisan_id,
      messages: messagesArray
    };

    result(null, {
      status: 201,
      msg: "Discussion added with success!",
      data: createdDiscussion
    });
  });
};

/************ Récupérer toutes les discussions ***********************/
Discussion.getAll = (result) => {
  const selectQuery = `SELECT * FROM discussions`;

  db.query(selectQuery, (err, res) => {
    if (err) {
      return result(err, { status: 400, msg: "Error retrieving discussions" });
    }

    result(null, {
      status: 200,
      msg: "All discussions retrieved successfully",
      data: res
    });
  });
};

/************ Récupérer les discussions par client id ***********************/
Discussion.getByClientId = (client_id, result) => {
  // Vérifier si le client_id correspond à un utilisateur avec le rôle 'client'
  const clientExistsQuery = `SELECT 1 FROM users WHERE user_id = ? AND role = 'client'`;
  db.query(clientExistsQuery, [client_id], (err, res) => {
    if (err) {
      return result({ status: 500, msg: "Error checking client existence." }, null);
    }
    if (res.length === 0) {
      return result({ status: 404, msg: `Client with ID ${client_id} does not exist or is not a client.` }, null);
    }

    // Récupérer les discussions pour ce client_id
    const selectQuery = `SELECT * FROM discussions WHERE client_id = ?`;
    db.query(selectQuery, [client_id], (err, res) => {
      if (err) {
        return result({ status: 500, msg: "Error retrieving discussions." }, null);
      }
      if (res.length === 0) {
        return result({ status: 404, msg: `No discussions found for client with ID ${client_id}.` }, null);
      }

      result(null, {
        status: 200,
        msg: `Discussions for client with ID ${client_id} retrieved successfully.`,
        data: res
      });
    });
  });
};

/************ Récupérer les discussions par artisan id ***********************/
Discussion.getByArtisanId = (artisan_id, result) => {
  // Vérifier si l'artisan_id correspond à un utilisateur avec le rôle 'artisan'
  const artisanExistsQuery = `SELECT 1 FROM users WHERE user_id = ? AND role = 'artisan'`;
  db.query(artisanExistsQuery, [artisan_id], (err, res) => {
    if (err) {
      return result({ status: 500, msg: "Error checking artisan existence." }, null);
    }
    if (res.length === 0) {
      return result({ status: 404, msg: `Artisan with ID ${artisan_id} does not exist or is not an artisan.` }, null);
    }

    // Récupérer les discussions pour ce artisan_id
    const selectQuery = `SELECT * FROM discussions WHERE artisan_id = ?`;
    db.query(selectQuery, [artisan_id], (err, res) => {
      if (err) {
        return result({ status: 500, msg: "Error retrieving discussions." }, null);
      }
      if (res.length === 0) {
        return result({ status: 404, msg: `No discussions found for artisan with ID ${artisan_id}.` }, null);
      }

      result(null, {
        status: 200,
        msg: `Discussions for artisan with ID ${artisan_id} retrieved successfully.`,
        data: res
      });
    });
  });
};


/************ Mettre à jour une discussion par ID ***********************/
Discussion.updateById = (discussion, result) => {
  const selectQuery = `SELECT messages FROM discussions WHERE discussion_id = ?`;
  db.query(selectQuery, [discussion.discussion_id], (err, res) => {
    if (err) {
      return result(err, { status: 400, msg: "Error retrieving discussion" });
    }

    if (res.length === 0) {
      return result({ status: 404, msg: `Discussion with ID ${discussion.discussion_id} not found!` });
    }

    let currentMessagesArray;
    try {
      currentMessagesArray = typeof res[0].messages === 'string' ? JSON.parse(res[0].messages) : res[0].messages;
    } catch (parseErr) {
      return result({ status: 500, msg: "Error parsing existing messages." });
    }

    const updatedMessages = discussion.messages.map(msg => ({
      text: msg.text,
      user_id: msg.user_id,
      time: getCurrentTimeInFrance()
    }));

    currentMessagesArray.push(...updatedMessages);

    const updateQuery = `UPDATE discussions SET messages = ? WHERE discussion_id = ?`;
    const values = [JSON.stringify(currentMessagesArray), discussion.discussion_id];

    db.query(updateQuery, values, (err, res) => {
      if (err) {
        return result(err, { status: 400, msg: "Error updating discussion" });
      }

      const selectUpdatedQuery = `SELECT * FROM discussions WHERE discussion_id = ?`;
      db.query(selectUpdatedQuery, [discussion.discussion_id], (err, res) => {
        if (err) {
          return result(err, { status: 400, msg: "Error retrieving updated discussion" });
        }

        if (res.length === 0) {
          return result({ status: 404, msg: `Discussion with ID ${discussion.discussion_id} not found!` });
        } else {
          result(null, {
            status: 200,
            msg: "Discussion updated with success!",
            data: res[0]
          });
        }
      });
    });
  });
};

module.exports = Discussion;

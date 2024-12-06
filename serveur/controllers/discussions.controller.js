const Discussion = require("../models/discussions.model.js");

/************ Créer une nouvelle discussion ***********************/
const createDiscussion = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "No discussion created." });
  }

  const discussion = {
    client_id: req.body.client_id,
    artisan_id: req.body.artisan_id,
    messages: req.body.messages // Messages doivent inclure un objet avec text et user_id
  };

  Discussion.create(discussion, (err, result) => {
    if (err) {
      return res.status(result.status || 500).send({ status: result.status || 500, msg: result.msg || "Error creating discussion" });
    }
    res.status(result.status).send(result);
  });
};

/************ Récupérer toutes les discussions ***********************/
const getAllDiscussions = (req, res) => {
  Discussion.getAll((err, result) => {
    if (err) {
      return res.status(result.status).send({ status: result.status, msg: result.msg });
    }
    res.status(result.status).send(result);
  });
};

/************ Récupérer les discussions par client id ***********************/
const getDiscussionsByClientId = (req, res) => {
  const client_id = req.params.client_id;

  if (!client_id) {
    return res.status(400).json({ message: "Client ID is required." });
  }

  Discussion.getByClientId(client_id, (err, result) => {
    if (err) {
      // Assurez-vous que `result` n'est pas null et que `status` est défini
      const status = err.status || 500;
      const msg = err.msg || "Unknown error occurred";
      return res.status(status).json({ status, msg });
    }
    res.status(result.status).json(result);
  });
};

/************ Récupérer les discussions par artisan id ***********************/
const getDiscussionsByArtisanId = (req, res) => {
  const artisan_id = req.params.artisan_id;

  if (!artisan_id) {
    return res.status(400).json({ message: "Artisan ID is required." });
  }

  Discussion.getByArtisanId(artisan_id, (err, result) => {
    if (err) {
      // Assurez-vous que `result` n'est pas null et que `status` est défini
      const status = err.status || 500;
      const msg = err.msg || "Unknown error occurred";
      return res.status(status).json({ status, msg });
    }
    res.status(result.status).json(result);
  });
};

/************ Controller update discussion ***********************/
const updateDiscussionById = (req, res) => {
  if (!req.body || !req.params.discussion_id) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  const discussion = {
    discussion_id: req.params.discussion_id,
    messages: req.body.messages // Messages doivent inclure un tableau d'objets {text, user_id}
  };

  Discussion.updateById(discussion, (err, result) => {
    if (err) {
      return res.status(result?.status || 500).send({ status: result?.status || 500, msg: result?.msg || "Error updating discussion" });
    }
    res.status(result.status).send(result);
  });
};

module.exports = {
  createDiscussion,
  getAllDiscussions,
  getDiscussionsByClientId,
  getDiscussionsByArtisanId,
  updateDiscussionById
};

import AuthorsCollection from "../db/AuthorsCollection.js";

const authorsFunctions = {
  // Add author to database
  add: async (req, res) => {
    try {
      const author = req.body;
      // implement checks
      if (author.name == "" || author.country == "") {
        throw new Error("Invalid author data");
      }

      // add author to database
      const id = await AuthorsCollection.add(author)
      res.status(200).json({ added: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all authors from database
  getAll: async (req, res) => {
    try {
      const authors = await AuthorsCollection.getAll();
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get authors by ids
  getAuthors: async (req, res) => {
    try {
      const ids = req.body;
      const authors = await AuthorsCollection.getAuthors(ids);
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // get author by id
  get: async (req, res) => {
    try {
      const id = req.params.id;
      const author = await AuthorsCollection.get(id);
      res.status(200).json(author);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // delete author by id
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      await AuthorsCollection.delete(id);
      res.status(200).json({ deleted: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // update author by id
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const author = req.body;
      await AuthorsCollection.update(id, author);
      res.status(200).json({ updated: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default authorsFunctions;

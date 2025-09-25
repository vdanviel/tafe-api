
import express from "express";
import { constructionController } from "../controller/constructionController.js";

const constructionRouter = express.Router();

// Buscar por ID
constructionRouter.get('/:id', (req, res) => {
	constructionController.find(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Criar novo registro
constructionRouter.post('/register', (req, res) => {
	// Ajuste os campos conforme o model
	const { value1, value2, value3 } = req.body;
	constructionController.create(value1, value2, value3)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Atualizar registro
constructionRouter.put('/update/:id', (req, res) => {
	const { value1, value2, value3 } = req.body;
	constructionController.update(req.params.id, value1, value2, value3)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Deletar registro
constructionRouter.delete('/delete/:id', (req, res) => {
	constructionController.delete(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Alternar status
constructionRouter.patch('/toggle-status/:id', (req, res) => {
	constructionController.toggleStatus(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

export { constructionRouter };

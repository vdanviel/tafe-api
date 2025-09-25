
import express from "express";
import { accidentController } from "../controller/accidentController.js";

const accidentRouter = express.Router();

// Buscar por ID
accidentRouter.get('/:id', (req, res) => {
	accidentController.find(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Criar novo registro
accidentRouter.post('/register', (req, res) => {
	// Ajuste os campos conforme o model
	const { value1, value2, value3 } = req.body;
	accidentController.create(value1, value2, value3)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Atualizar registro
accidentRouter.put('/update/:id', (req, res) => {
	const { value1, value2, value3 } = req.body;
	accidentController.update(req.params.id, value1, value2, value3)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Deletar registro
accidentRouter.delete('/delete/:id', (req, res) => {
	accidentController.delete(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Alternar status
accidentRouter.patch('/toggle-status/:id', (req, res) => {
	accidentController.toggleStatus(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

export { accidentRouter };

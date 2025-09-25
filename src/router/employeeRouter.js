
import express from "express";
import { employeeController } from "../controller/employeeController.js";

const employeeRouter = express.Router();

// Buscar por ID
employeeRouter.get('/:id', (req, res) => {
	employeeController.find(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Criar novo registro
employeeRouter.post('/register', (req, res) => {
	// Ajuste os campos conforme o model
	const { value1, value2, value3 } = req.body;
	employeeController.create(value1, value2, value3)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Atualizar registro
employeeRouter.put('/update/:id', (req, res) => {
	const { value1, value2, value3 } = req.body;
	employeeController.update(req.params.id, value1, value2, value3)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Deletar registro
employeeRouter.delete('/delete/:id', (req, res) => {
	employeeController.delete(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

// Alternar status
employeeRouter.patch('/toggle-status/:id', (req, res) => {
	employeeController.toggleStatus(req.params.id)
		.then(result => {
			res.send(result);
		})
		.catch(error => {
			res.status(500).send({ error: error.message });
		});
});

export { employeeRouter };

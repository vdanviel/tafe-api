import express from "express";
import { body } from "express-validator";
import { constructionController } from "../controller/constructionController.js";
import { isAuth } from "../middleware/auth.js";
import { checkScope } from "../middleware/scope.js";

const constructionRouter = express.Router();

// Middleware de validação para os dados
const validateConstructionData = [
	body('projectName').notEmpty().withMessage('Project name is required'),
	body('description').notEmpty().withMessage('Description is required'),
	body('address.street').notEmpty().withMessage('Street is required'),
	body('address.number').notEmpty().withMessage('Number is required'),
	body('address.complement').optional(),
	body('address.neighborhood').notEmpty().withMessage('Neighborhood is required'),
	body('address.city').notEmpty().withMessage('City is required'),
	body('startDate').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Start date must be a valid date'),
	body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
	body('manager').notEmpty().withMessage('Manager is required')
];

// Buscar por ID
constructionRouter.get('/:id', isAuth, checkScope("read:construction"), (req, res) => {
	constructionController.find(req.params.id)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Buscar todos
constructionRouter.get('/', isAuth, checkScope("read:construction"), (req, res) => {
	constructionController.findAll()
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Criar novo registro
constructionRouter.post('/register', isAuth, checkScope("write:construction"), validateConstructionData, (req, res) => {
	const { projectName, description, address, startDate, endDate, manager } = req.body;
	constructionController.create(projectName, description, address, startDate, endDate, manager)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Atualizar registro
constructionRouter.put('/update/:id', isAuth, checkScope("update:construction"), validateConstructionData, (req, res) => {
	const { projectName, description, address, startDate, endDate, manager } = req.body;
	constructionController.update(req.params.id, projectName, description, address, startDate, endDate, manager)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Deletar registro
constructionRouter.delete('/delete/:id', isAuth, checkScope("delete:construction"), (req, res) => {
	constructionController.delete(req.params.id)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Alternar status
constructionRouter.patch('/toggle-status/:id', isAuth, checkScope("update:construction"), (req, res) => {
	constructionController.toggleStatus(req.params.id)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

export { constructionRouter };

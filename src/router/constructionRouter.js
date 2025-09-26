import express from "express";
import { body } from "express-validator";
import { constructionController } from "../controller/constructionController.js";
import { isAuth } from "../middleware/auth.js";
import { checkScope } from "../middleware/scope.js";

const constructionRouter = express.Router();

// Middleware de validação para os dados
const validateConstructionData = [
	body('projectName').notEmpty().withMessage('O nome do projeto é obrigatório'),
	body('description').notEmpty().withMessage('A descrição é obrigatória'),
	body('address.street').notEmpty().withMessage('A rua é obrigatória'),
	body('address.number').notEmpty().withMessage('O número é obrigatório'),
	body('address.complement').optional({ nullable: true }),
	body('address.neighborhood').notEmpty().withMessage('O bairro é obrigatório'),
	body('address.city').notEmpty().withMessage('A cidade é obrigatória'),
	body('startDate').notEmpty().withMessage('A data de início é obrigatória').isISO8601().withMessage('A data de início deve ser uma data válida'),
	body('endDate').exists().withMessage("A data de término deve ser enviada").optional({ nullable: true }),
	body('manager').notEmpty().withMessage('O responsável é obrigatório')
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

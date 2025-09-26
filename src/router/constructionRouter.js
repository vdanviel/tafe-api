import express from "express";
import { constructionController } from "../controller/constructionController.js";
import { isAuth } from "../middleware/auth.js";
import { checkScope } from "../middleware/scope.js";
import { body, validationResult } from "express-validator";

const constructionRouter = express.Router();

// Middleware para CRIAR (rígido, exige todos os campos)
const validateConstructionData = [
    body('projectName').exists().withMessage('O nome do projeto é obrigatório'),
    body('description').exists().withMessage('A descrição é obrigatória'),
    body('address.street').exists().withMessage('A rua é obrigatória'),
    body('address.number').exists().withMessage('O número é obrigatório'),
    body('address.complement').optional({ nullable: true }),
    body('address.neighborhood').exists().withMessage('O bairro é obrigatório'),
    body('address.city').exists().withMessage('A cidade é obrigatória'),
    body('startDate').exists().withMessage('A data de início é obrigatória').isISO8601().withMessage('A data de início deve ser uma data válida'),
    body('endDate').exists().withMessage("A data de término deve ser enviada").optional({ nullable: true }),
    body('manager').exists().withMessage('O responsável é obrigatório')
];

// Middleware para ATUALIZAR (flexível, valida apenas os campos enviados)
const validateUpdateData = [
    body('projectName').optional().exists().withMessage('O nome do projeto não pode ser vazio'),
    body('description').optional().exists().withMessage('A descrição não pode ser vazia'),
    body('address.street').optional().exists().withMessage('A rua não pode ser vazia'),
    body('address.number').optional().exists().withMessage('O número não pode ser vazio'),
    body('address.complement').optional({ nullable: true }),
    body('address.neighborhood').optional().exists().withMessage('O bairro não pode ser vazio'),
    body('address.city').optional().exists().withMessage('A cidade não pode ser vazia'),
    body('startDate').optional().isISO8601().withMessage('A data de início deve ser uma data válida'),
    body('endDate').optional({ nullable: true }).isISO8601().withMessage('A data de término deve ser uma data válida'),
    body('manager').optional().exists().withMessage('O responsável não pode ser vazio')
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
constructionRouter.post('/register', validateConstructionData, isAuth, checkScope("write:construction"),  (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Se houver erros, retorne 400 com a lista de erros
		return res.status(400).json({ errors: errors.array() });
	}

	const { projectName, description, address, startDate, endDate, manager } = req.body;
	constructionController.create(projectName, description, address, startDate, endDate, manager)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Atualizar registro
constructionRouter.put('/update/:id', validateUpdateData, isAuth, checkScope("update:construction"),  (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Se houver erros, retorne 400 com a lista de erros
		return res.status(400).json({ errors: errors.array() });
	}

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

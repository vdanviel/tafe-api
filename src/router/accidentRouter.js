import express from "express";
import { body, validationResult } from "express-validator";
import { accidentController } from "../controller/accidentController.js";
import { isAuth } from "../middleware/auth.js";
import { checkScope } from "../middleware/scope.js";

const accidentRouter = express.Router();

// Middleware de validação para os dados
const validateAccidentData = [
	body('cause').exists().withMessage('A causa é obrigatória'),
	body('description').exists().withMessage('A descrição é obrigatória'),
	body('severity').exists().withMessage('A gravidade é obrigatória'),
	body('constructionId').exists().withMessage('O ID da obra é obrigatório').isMongoId().withMessage('O ID da obra deve ser um MongoDB ID válido'),
	body('involved').isArray().withMessage('Envolvidos deve ser um array').optional(),
	body('involved.*.firstName').exists().withMessage('O nome do envolvido é obrigatório'),
	body('involved.*.lastName').exists().withMessage('O sobrenome do envolvido é obrigatório'),
	body('involved.*.objectInvolved').optional(),
	body('involved.*.hurted').isBoolean().withMessage('Ferido deve ser um valor booleano'),
	body('involved.*.additionalInformation').optional()
];

const validateUpdateData = [
    body('cause').optional().exists().withMessage('A causa não pode ser vazia'),
    body('description').optional().exists().withMessage('A descrição não pode ser vazia'),
    body('severity').optional().exists().withMessage('A gravidade não pode estar vazia'),
    body('constructionId').optional().isMongoId().withMessage('O ID da obra deve ser um MongoDB ID válido'),
    body('involved').optional().exists().withMessage('Se enviado, deve haver ao menos um envolvido'),
    body('involved.*.firstName').optional().exists().withMessage('O nome do envolvido não pode ser vazio'),
	body('involved.*.lastName').optional().exists().withMessage('O sobrenome do envolvido não pode ser vazio'),
	body('involved.*.objectInvolved').optional(),
	body('involved.*.hurted').optional().isBoolean().withMessage('Ferido deve ser um valor booleano'),
	body('involved.*.additionalInformation').optional()
];

// Buscar por ID
accidentRouter.get('/:id', isAuth, checkScope("read:accident"), (req, res) => {
	accidentController.find(req.params.id)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Buscar todos
accidentRouter.get('/', isAuth, checkScope("read:accident"), (req, res) => {
	accidentController.findAll()
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Criar novo registro
accidentRouter.post('/register', validateAccidentData, isAuth, checkScope("write:accident"), (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Se houver erros, retorne 400 com a lista de erros
		return res.status(400).json({ errors: errors.array() });
	}

	const { cause, description, severity, constructionId, involved } = req.body;
	accidentController.create(cause, description, severity, constructionId, req.auth.data._id, involved)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Atualizar registro
accidentRouter.put('/update/:id', validateUpdateData, isAuth, checkScope("update:accident"),  (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Se houver erros, retorne 400 com a lista de erros
		return res.status(400).json({ errors: errors.array() });
	}

	const { cause, description, severity, constructionId, involved } = req.body;
	accidentController.update(req.params.id, cause, description, severity, constructionId, req.auth.data._id, involved)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Deletar registro
accidentRouter.delete('/delete/:id', isAuth, checkScope("delete:accident"), (req, res) => {
	accidentController.delete(req.params.id)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Alternar status
accidentRouter.patch('/toggle-status/:id', isAuth, checkScope("update:accident"), (req, res) => {
	accidentController.toggleStatus(req.params.id)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

export { accidentRouter };

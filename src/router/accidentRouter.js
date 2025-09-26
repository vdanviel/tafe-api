import express from "express";
import { body } from "express-validator";
import { accidentController } from "../controller/accidentController.js";
import { isAuth } from "../middleware/auth.js";
import { checkScope } from "../middleware/scope.js";

const accidentRouter = express.Router();

// Middleware de validação para os dados
const validateAccidentData = [
	body('cause').notEmpty().withMessage('A causa é obrigatória'),
	body('description').notEmpty().withMessage('A descrição é obrigatória'),
	body('severity').notEmpty().withMessage('A gravidade é obrigatória').isInt({ min: 1, max: 5 }).withMessage('A gravidade deve ser um número inteiro entre 1 e 5'),
	body('constructionId').notEmpty().withMessage('O ID da obra é obrigatório').isMongoId().withMessage('O ID da obra deve ser um MongoDB ID válido'),
	body('involved').isArray().withMessage('Envolvidos deve ser um array').optional(),
	body('involved.*.firstName').notEmpty().withMessage('O nome do envolvido é obrigatório'),
	body('involved.*.lastName').notEmpty().withMessage('O sobrenome do envolvido é obrigatório'),
	body('involved.*.objectInvolved').optional(),
	body('involved.*.hurted').isBoolean().withMessage('Ferido deve ser um valor booleano'),
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
accidentRouter.post('/register', isAuth, checkScope("write:accident"), validateAccidentData, (req, res) => {
	const { cause, description, severity, constructionId, involved } = req.body;
	accidentController.create(cause, description, severity, constructionId, req.auth.data._id, involved)
		.then(result => res.send(result))
		.catch(error => res.status(500).send({ error: error.message }));
});

// Atualizar registro
accidentRouter.put('/update/:id', isAuth, checkScope("update:accident"), validateAccidentData, (req, res) => {
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

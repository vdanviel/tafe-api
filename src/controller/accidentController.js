import { ObjectId } from 'mongodb';
import { Accident } from "../model/accident.js";
import { constructionController } from "./constructionController.js";
import { CustomerController } from "./customerController.js";
import Util from "../util/util.js"; // Importa Util, utilitario do sistema

class Controller {
	async find(id) {
		// Busca por ID com status = true
		const accident = await Accident.findOne({ _id: new ObjectId(id), status: true });
		if (!accident) return { error: "Não encontrado." };
		return accident;
	}

	async findAll() {
		// Busca todos com status = true
		const accidents = await Accident.find({ status: true }).toArray();
		return accidents;
	}

	async create(cause, description, severity, constructionId, reporterId, involvedData) {
		// Monta o objeto construction
		const construction = await constructionController.find(constructionId);
		if (construction.error) return { error: "Construção não encontrada." };

		// Busca o reporter (customer)
		const reporter = await CustomerController.find(reporterId);
		if (reporter.error) return { error: "Reporter não encontrado." };

		// Monta o array involved
		const involved = involvedData.map(person => ({
			firstName: person.firstName,
			lastName: person.lastName,
			objectInvolved: person.objectInvolved,
			hurted: person.hurted,
			additionalInformation: person.additionalInformation
		}));

		const data = {
			cause,
			description,
			severity,
			construction,
			reporter,
			involved,
			status: true,
			createdAt: Util.currentDateTime('America/Sao_Paulo'),
			updatedAt: Util.currentDateTime('America/Sao_Paulo')
		};

		await Accident.insertOne(data);
		return data;
	}

	async update(accidentId, cause, description, severity, constructionId, reporterId, involvedData) {

		// 1. Agrupa todos os argumentos de atualização em um único objeto.
		const potentialUpdates = {
			cause,
			description,
			severity,
			constructionId,
			reporterId,
			involvedData
		};

		// 2. Constrói dinamicamente o objeto $set, processando apenas os valores definidos.
		// Object.entries transforma {a: 1, b: 2} em [['a', 1], ['b', 2]]
		// .reduce() itera sobre esse array para construir um novo objeto final.
		const fieldsToUpdate = Object.entries(potentialUpdates).reduce((acc, [key, value]) => {
			// Ignora qualquer chave cujo valor seja undefined
			if (value === undefined) {
				return acc;
			}

			if (key === 'constructionId') {
				
				if (value != undefined || value != null) {
					
					// Busca a construção
					const construction = constructionController.find(value);
					if (construction.error) {
						return construction; // Retorna o erro encontrado
					}

					acc[key] = construction;
				}

			}else if(key === 'reporterId'){

				if (value != undefined || value != null) {

					// Busca o customer
					const customer = CustomerController.find(value);
					if (customer.error) {
						return customer; // Retorna o erro encontrado
					}

					acc[key] = customer;
				}


			}else if(key === 'involved'){

				if (value != null) {

					// Verifica se é array
					if (!Array.isArray(value)) {
						return { error: "O dado 'involved' deve ser array de objetos." };
					}

					// Mapeia os dados
					value.map(person => {

						if (typeof person != 'object') {
							return { error: "O dado 'involved' deve conter somente objetos ({})." };
						} 

					});

				}

				acc[key] = value;
			} else {
				acc[key] = value;
			}
			

			return acc;
		}, {}); // Inicia com um acumulador (acc) que é um objeto vazio.

		// 3. Se nenhum campo válido foi enviado, não há necessidade de atualizar o DB.
		if (Object.keys(fieldsToUpdate).length === 0) {
			// Retorna o objeto existente sem alterá-lo.
			return await this.find(constructionId); 
		}

		// 4. Adiciona a data de atualização e executa a query.
		fieldsToUpdate.updatedAt = Util.currentDateTime('America/Sao_Paulo');

		const result = await Accident.updateOne(
			{ _id: new ObjectId(accidentId) },
			{ $set: fieldsToUpdate }
		);

		if (result.matchedCount === 0) {
			return { error: "Não encontrado." };
		}

		// Retorna o documento recém-atualizado.
		return await this.find(accidentId);
	}

	async delete(accidentId) {
		// Deleta registro
		const result = await Accident.deleteOne({ _id: new ObjectId(accidentId) });
		if (result.deletedCount === 0) return { error: "Não encontrado." };
		return { message: "Deletado com sucesso." };
	}

	async toggleStatus(accidentId) {
		// Alterna status booleano
		const accident = await Accident.findOne({ _id: new ObjectId(accidentId) });
		if (!accident) return { error: "Não encontrado." };

		const newStatus = !accident.status;

		await Accident.updateOne(
			{ _id: new ObjectId(accidentId) },
			{ $set: { status: newStatus, updatedAt: Util.currentDateTime('America/Sao_Paulo') } }
		);
		return { message: `Status ${newStatus ? 'ativado' : 'desativado'} com sucesso.` };
	}
}

const accidentController = new Controller();
export { accidentController };

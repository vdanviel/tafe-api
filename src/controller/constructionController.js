import { ObjectId } from 'mongodb';
import { Construction } from "../model/construction.js";
import Util from "../util/util.js"; // Importa Util, utilitario do sistema

class Controller {
	async find(id) {
		// Busca por ID com status = true
		const construction = await Construction.findOne({ _id: new ObjectId(id), status: true });
		if (!construction) return { error: "Não encontrado." };
		return construction;
	}

	async findAll() {
		// Busca todos com status = true
		const constructions = await Construction.find({ status: true }).toArray();
		return constructions;
	}

	async create(projectName, description, address, startDate, endDate, manager) {
		
		const data = {
			projectName,
			description,
			address,
			manager,
			status: true,
			startDate: Util.formatDate(startDate),
			endDate: endDate ? Util.formatDate(endDate) : null,
			createdAt: Util.currentDateTime('America/Sao_Paulo'),
			updatedAt: Util.currentDateTime('America/Sao_Paulo')
		};

		await Construction.insertOne(data);
		return data;
	}

	async update(constructionId, projectName, description, address, startDate, endDate, manager) {

		// 1. Agrupa todos os argumentos de atualização em um único objeto.
		const potentialUpdates = {
			projectName,
			description,
			address,
			startDate,
			endDate,
			manager
		};

		// 2. Constrói dinamicamente o objeto $set, processando apenas os valores definidos.
		// Object.entries transforma {a: 1, b: 2} em [['a', 1], ['b', 2]]
		// .reduce() itera sobre esse array para construir um novo objeto final.
		const fieldsToUpdate = Object.entries(potentialUpdates).reduce((acc, [key, value]) => {
			// Ignora qualquer chave cujo valor seja undefined
			if (value === undefined) {
				return acc;
			}

			// Aplica lógicas especiais para campos específicos
			if (key === 'startDate') {
				acc[key] = Util.formatDate(value);
			} else if(key === 'address'){

				if (value != null) {

					// Verifica se é array
					if (typeof value != 'object') {
						return { error: "O dado 'address' deve ser um objeto." };
					}

				}

				acc[key] = value;
			} else if (key === 'endDate') {
				// Permite que a data de término seja definida como null
				acc[key] = value ? Util.formatDate(value) : null;
			} else {
				// Para todos os outros campos, apenas copia o valor
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

		const result = await Construction.updateOne(
			{ _id: new ObjectId(constructionId) },
			{ $set: fieldsToUpdate }
		);

		if (result.matchedCount === 0) {
			return { error: "Não encontrado." };
		}

		// Retorna o documento recém-atualizado.
		return await this.find(constructionId);
	}

	async delete(constructionId) {
		// Deleta registro
		const result = await Construction.deleteOne({ _id: new ObjectId(constructionId) });
		if (result.deletedCount === 0) return { error: "Não encontrado." };
		return { message: "Deletado com sucesso." };
	}

	async toggleStatus(constructionId) {
		// Alterna status booleano
		const construction = await Construction.findOne({ _id: new ObjectId(constructionId) });
		if (!construction) return { error: "Não encontrado." };

		const newStatus = !construction.status;

		await Construction.updateOne(
			{ _id: new ObjectId(constructionId) },
			{ $set: { status: newStatus, updatedAt: Util.currentDateTime('America/Sao_Paulo') } }
		);
		return { message: `Status ${newStatus ? 'ativado' : 'desativado'} com sucesso.` };
	}
}

const constructionController = new Controller();
export { constructionController };

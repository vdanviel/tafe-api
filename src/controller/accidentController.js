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
			updatedAt: Util.currentDateTime('America/Sao_Paulo')
		};

		const result = await Accident.updateOne(
			{ _id: new ObjectId(accidentId) },
			{ $set: data }
		);
		if (result.matchedCount === 0) return { error: "Não encontrado." };
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

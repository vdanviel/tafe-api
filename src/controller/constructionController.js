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
		const data = {
			projectName,
			description,
			address,
			startDate: Util.formatDate(startDate),
			endDate: endDate ? Util.formatDate(endDate) : null,
			manager,
			updatedAt: Util.currentDateTime('America/Sao_Paulo')
		};

		const result = await Construction.updateOne(
			{ _id: new ObjectId(constructionId) },
			{ $set: data }
		);
		if (result.matchedCount === 0) return { error: "Não encontrado." };
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

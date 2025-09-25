import { ObjectId } from 'mongodb';
import { Construction } from "../model/construction.js";
import Util from "../util/util.js"; // Importa Util, utilitario do sistema

class Controller {
	async find(id) {
		// Busca por ID
		const construction = await Construction.findOne({ _id: new ObjectId(id) });
		if (!construction) return { error: "Não encontrado." };
		return construction;
	}

	async create(value1, value2, value3) {

        const data = {
            value_1: value1,
            value_2: value2,
            value_3: value3,
            status: true,
            createdAt: Util.currentDateTime('America/Sao_Paulo'),
            updatedAt: Util.currentDateTime('America/Sao_Paulo')
        };

        //restante dos dados...

		await Construction.insertOne(data);
		return data;
	}

	async update(constructionId, value1, value2, value3) {
		// Atualiza registro
		data.updatedAt = new Date();
		const result = await Construction.updateOne(
			{ _id: new ObjectId(constructionId) },
			{ $set: {
                value_1: value1,
                value_2: value2,
                value_3: value3,
                updatedAt: Util.currentDateTime('America/Sao_Paulo')
            } }
		);
		if (result.matchedCount === 0) return { error: "Não encontrado." };
		return await this.find(id);
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

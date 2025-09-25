import { ObjectId } from 'mongodb';
import { Accident } from "../model/accident.js";
import Util from "../util/util.js"; // Importa Util, utilitario do sistema

class Controller {
	async find(id) {
		// Busca por ID
		const accident = await Accident.findOne({ _id: new ObjectId(id) });
		if (!accident) return { error: "Não encontrado." };
		return accident;
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

		await Accident.insertOne(data);
		return data;
	}

	async update(accidentId, value1, value2, value3) {
		// Atualiza registro
		data.updatedAt = new Date();
		const result = await Accident.updateOne(
			{ _id: new ObjectId(accidentId) },
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

import { ObjectId } from 'mongodb';
import { Employee } from "../model/employee.js";
import Util from "../util/util.js"; // Importa Util, utilitario do sistema

class Controller {
	async find(id) {
		// Busca por ID
		const employee = await Employee.findOne({ _id: new ObjectId(id) });
		if (!employee) return { error: "Não encontrado." };
		return employee;
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

		await Employee.insertOne(data);
		return data;
	}

	async update(employeeId, value1, value2, value3) {
		// Atualiza registro
		data.updatedAt = new Date();
		const result = await Employee.updateOne(
			{ _id: new ObjectId(employeeId) },
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

	async delete(employeeId) {
		// Deleta registro
		const result = await Employee.deleteOne({ _id: new ObjectId(employeeId) });
		if (result.deletedCount === 0) return { error: "Não encontrado." };
		return { message: "Deletado com sucesso." };
	}

	async toggleStatus(employeeId) {
		// Alterna status booleano
		const employee = await Employee.findOne({ _id: new ObjectId(employeeId) });
		if (!employee) return { error: "Não encontrado." };

		const newStatus = !employee.status;

		await Employee.updateOne(
			{ _id: new ObjectId(employeeId) },
			{ $set: { status: newStatus, updatedAt: Util.currentDateTime('America/Sao_Paulo') } }
		);
		return { message: `Status ${newStatus ? 'ativado' : 'desativado'} com sucesso.` };
	}
}

const employeeController = new Controller();
export { employeeController };

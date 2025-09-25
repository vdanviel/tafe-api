import { database } from "../connection/database.js";

class EmployeeModel {
  constructor() {
    this.collection = database.collection('employee');
  }

  getCollection() {
    return this.collection;
  }
}

const Employee = new EmployeeModel().getCollection();
export { Employee };
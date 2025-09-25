import { database } from "../connection/database.js";

class AccidentModel {
  constructor() {
    this.collection = database.collection('accident');
  }

  getCollection() {
    return this.collection;
  }
}

const Accident = new AccidentModel().getCollection();
export { Accident };
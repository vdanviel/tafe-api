import { database } from "../connection/database.js";

class ConstructionModel {
  constructor() {
    this.collection = database.collection('construction');
  }

  getCollection() {
    return this.collection;
  }
}

const Construction = new ConstructionModel().getCollection();
export { Construction };
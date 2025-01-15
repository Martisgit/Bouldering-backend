import Beta from "../model/betaModel.js";

const cascadeDeleteBetas = async function (next) {
  try {
    const boulderId = this.getQuery().id;
    await Beta.deleteMany({ boulderId });
    next();
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

export default cascadeDeleteBetas;

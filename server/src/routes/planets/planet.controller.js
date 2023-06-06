const { getAllPlanets } = require("../../model/planet.model");

function httpGetAllPlanets(req, res) {
  res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};

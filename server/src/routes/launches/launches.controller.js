const {
  getAllLaunches,
  addNewLunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../model/lunches.model");

function httpGetAllLaunches(req, res) {
  res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  addNewLunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchdId = Number(req.params.id);
  if (!existsLaunchWithId(launchdId)) {
    return res.status(404).json({
      error: "Launch not found ",
    });
  }
  const aborted = abortLaunchById(launchdId);
  return res.status(200).json(aborted);
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};

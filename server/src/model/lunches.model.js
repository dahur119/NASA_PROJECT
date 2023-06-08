const launchesDatabase = require("./launches.mongo");
const planets = require("./planet.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer ISI",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-296 A f",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLunch(launch);

// launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestLunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLunch.flightNumber;
}
async function getAllLaunches() {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLunch(launch) {
  const planet = await planets.findOne(
    {
      keplerName: launch.target,
    },
    {
      _id: 0,
      __v: 0,
    }
  );
  if (!planet) {
    throw new Error("No matching planet found");
  }
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customer: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLunch(newLaunch);
}

async function abortLaunchById(launchdId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchdId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};

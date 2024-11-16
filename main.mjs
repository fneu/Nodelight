import { createDirigeraClient } from 'dirigera';
import 'dotenv/config';

const accessToken = process.env.DIRIGERA_ACCESS_TOKEN;
const gatewayIP = process.env.DIRIGERA_IP

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logWithTimestamp(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
}

const client = await createDirigeraClient({ gatewayIP, accessToken });

const DAY_DEFAULTS = { colorTemperature: 3610, lightLevel: 100 };
const EVENING_DEFAULTS = {colorTemperature: 2710, lightLevel: 80 };
const LATE_DEFAULTS = {colorTemperature: 2202, lightLevel: 60}
const NIGHT_DEFAULTS = { colorTemperature: 2202, lightLevel: 1 };
const LIGHTS = {};

// Initialize lights status
const lights = await client.lights.list();
for (const light of lights) {
    LIGHTS[light.id] = {
        isReachable: light.isReachable,
        isOn: light.attributes.isOn,
        lightLevel: light.attributes.lightLevel
    };
}

const LIVINGROOMIDS = [
  '856fd37d-e2e3-4cf9-a344-794e5d4e4689_1',
  '89db715a-f495-441c-8409-9c4aab5e7263_1',
  '16ba0062-a191-43a0-829a-1ab315cc2ab1_1',
  'e0e4327b-846a-4193-8d23-71d8fb3fe06a_1',
  'e9e48657-7df5-40e3-882d-f661c9017bc8_1'
]
const BEDROOMIDS = [
  'b1dc943d-3c0a-4ed4-85f1-c1adf64d512d_1',
  'e4c330d7-5441-44e0-ae21-312a331d5d4b_1',
  '45d5f3e6-b4e1-4a19-8434-def726650bc5_1'
]

logWithTimestamp("Initial LIGHTS state:");
console.log(LIGHTS);

async function makeEvening2000() {
    logWithTimestamp("It is 8 PM, setting evening defaults for reachable livingroom lights.");
    for (const [id, light] of Object.entries(LIGHTS)) {
        if (light.isReachable && light.isOn && LIVINGROOMIDS.includes(id)) {
            if (light.lightLevel > EVENING_DEFAULTS.lightLevel){
                logWithTimestamp(`Setting evening defaults for light ${id}`);
                await client.lights.setLightLevel({ id, lightLevel: EVENING_DEFAULTS.lightLevel });
                await sleep(250);
            } else {
                logWithTimestamp(`NOT setting evening defaults for light ${id} because it is already darker`);
            }
            await client.lights.setLightTemperature({ id, colorTemperature: EVENING_DEFAULTS.colorTemperature });
            await sleep(100);
        }
    }
}

function getInitialDelay2000() {
    const now = new Date();
    const target = new Date();
    target.setHours(20, 0, 0, 0);

    // If past 9 PM today, set target to 9 PM tomorrow
    if (now > target) target.setDate(target.getDate() + 1);

    return target - now;
}

const initialDelay2000 = getInitialDelay2000();
setTimeout(async () => {
    await makeEvening2000();
    setInterval(makeEvening2000, 24 * 60 * 60 * 1000); // Run every 24 hours
}, initialDelay2000);

async function makeEvening2100() {
    logWithTimestamp("It is 9 PM, setting late defaults for reachable livingroom lights.");
    for (const [id, light] of Object.entries(LIGHTS)) {
        if (light.isReachable && light.isOn && LIVINGROOMIDS.includes(id)) {
            if (light.lightLevel > LATE_DEFAULTS.lightLevel){
                logWithTimestamp(`Setting late defaults for light ${id}`);
                await client.lights.setLightLevel({ id, lightLevel: LATE_DEFAULTS.lightLevel });
                await sleep(250);
            } else {
                logWithTimestamp(`NOT setting late defaults for light ${id} because it is already darker`);
            }
            await client.lights.setLightTemperature({ id, colorTemperature: LATE_DEFAULTS.colorTemperature });
            await sleep(100);
        }
    }
}

function getInitialDelay2100() {
    const now = new Date();
    const target = new Date();
    target.setHours(21, 0, 0, 0);

    // If past 9 PM today, set target to 9 PM tomorrow
    if (now > target) target.setDate(target.getDate() + 1);

    return target - now;
}

const initialDelay2100 = getInitialDelay2100();
setTimeout(async () => {
    await makeEvening2100();
    setInterval(makeEvening2100, 24 * 60 * 60 * 1000); // Run every 24 hours
}, initialDelay2100);

async function makeEvening2145() {
    logWithTimestamp("It is 9:45 PM, setting late defaults for reachable bedroom lights.");
    for (const [id, light] of Object.entries(LIGHTS)) {
        if (light.isReachable && light.isOn && BEDROOMIDS.includes(id)) {
            if (light.lightLevel > LATE_DEFAULTS.lightLevel){
                logWithTimestamp(`Setting late defaults for light ${id}`);
                await client.lights.setLightLevel({ id, lightLevel: LATE_DEFAULTS.lightLevel });
                await sleep(250);
            } else {
                logWithTimestamp(`NOT setting late defaults for light ${id} because it is already darker`);
            }
            await client.lights.setLightTemperature({ id, colorTemperature: LATE_DEFAULTS.colorTemperature });
            await sleep(100);
        }
    }
}

function getInitialDelay2145() {
    const now = new Date();
    const target = new Date();
    target.setHours(21, 45, 0, 0);

    // If past 9 PM today, set target to 9 PM tomorrow
    if (now > target) target.setDate(target.getDate() + 1);

    return target - now;
}

const initialDelay2145 = getInitialDelay2145();
setTimeout(async () => {
    await makeEvening2145();
    setInterval(makeEvening2145, 24 * 60 * 60 * 1000); // Run every 24 hours
}, initialDelay2145);

async function makeEvening2215() {
    logWithTimestamp("It is 10:15 PM, setting night defaults for reachable bedroom lights.");
    for (const [id, light] of Object.entries(LIGHTS)) {
        if (light.isReachable && light.isOn && BEDROOMIDS.includes(id)) {
            if (light.lightLevel > NIGHT_DEFAULTS.lightLevel){
                logWithTimestamp(`Setting night defaults for light ${id}`);
                await client.lights.setLightLevel({ id, lightLevel: NIGHT_DEFAULTS.lightLevel });
                await sleep(250);
            } else {
                logWithTimestamp(`NOT setting night defaults for light ${id} because it is already darker`);
            }
            await client.lights.setLightTemperature({ id, colorTemperature: NIGHT_DEFAULTS.colorTemperature });
            await sleep(100);
        }
    }
}

function getInitialDelay2215() {
    const now = new Date();
    const target = new Date();
    target.setHours(22, 15, 0, 0);

    // If past 9 PM today, set target to 9 PM tomorrow
    if (now > target) target.setDate(target.getDate() + 1);

    return target - now;
}

const initialDelay2215 = getInitialDelay2215();
setTimeout(async () => {
    await makeEvening2215();
    setInterval(makeEvening2215, 24 * 60 * 60 * 1000); // Run every 24 hours
}, initialDelay2215);

// Listen for updates and adjust lights status
// Set default values if lights just came on
client.startListeningForUpdates(async (updateEvent) => {
    let { id: currentId, isReachable: updateIsReachable, attributes } = updateEvent.data || {};
    if (updateIsReachable == undefined) {
        updateIsReachable = true;
    }
    const isOn = attributes?.isOn ?? updateIsReachable;
    let lightLevel = attributes?.lightLevel

    if (updateEvent.type === "deviceStateChanged" && currentId in LIGHTS) {
        const light = LIGHTS[currentId];

        const shouldSetDefault = (updateIsReachable && isOn && (!light.isReachable || !light.isOn))

        if (updateIsReachable !== light.isReachable) {
            logWithTimestamp(`Light ${currentId} is reachable: ${light.isReachable} -> ${updateIsReachable}`)
            light.isReachable = updateIsReachable;
        }
        if (isOn !== light.isOn){
            logWithTimestamp(`Light ${currentId} is on: ${light.isOn} -> ${isOn}`)
            light.isOn = isOn;
        }

        if (shouldSetDefault) {
            const now = new Date();
            let timeOfDay = "day";
            let defaults = DAY_DEFAULTS;
            if (LIVINGROOMIDS.includes(currentId)){
                if (now.getHours() >= 21){
                    timeOfDay = "late"
                    defaults = LATE_DEFAULTS
                } else if (now.getHours() >= 20){
                    timeOfDay = "evening"
                    defaults = EVENING_DEFAULTS
                }
            } else if (BEDROOMIDS.includes(currentId)){
                if (now.getHours() >= 23 || (now.getHours() >= 22 && now.getMinutes() >= 15)){
                    timeOfDay = "night"
                    defaults = NIGHT_DEFAULTS
                } else if (now.getHours() >= 22 || (now.getHours() >= 21 && now.getMinutes() >= 45)){
                    timeOfDay = "late"
                    defaults = LATE_DEFAULTS
                }
            }

            logWithTimestamp(`Setting ${timeOfDay} defaults for light ${currentId}`);
            await client.lights.setLightLevel({ id: currentId, lightLevel: defaults.lightLevel });
            lightLevel = defaults.lightLevel
            await sleep(250);
            await client.lights.setLightTemperature({ id: currentId, colorTemperature: defaults.colorTemperature });
            await sleep(100);
        }

        if (lightLevel !== undefined){
            logWithTimestamp(`Light ${currentId} light level: ${light.lightLevel} -> ${lightLevel}`)
            light.lightLevel = lightLevel;
        }
    }
});

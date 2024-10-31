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
const NIGHT_DEFAULTS = { colorTemperature: 2710, lightLevel: 80 };
const LIGHTS = {};

// Initialize lights status
const lights = await client.lights.list();
for (const light of lights) {
    LIGHTS[light.id] = {
        isReachable: light.isReachable,
        isOn: light.attributes.isOn
    };
}

logWithTimestamp("Initial LIGHTS state:");
console.log(LIGHTS);

async function makeEvening() {
    logWithTimestamp("It is 9 PM, setting night defaults for reachable lights.");
    for (const [id, light] of Object.entries(LIGHTS)) {
        if (light.isReachable && light.isOn) {
            logWithTimestamp(`Setting night defaults for light ${id}`);
            await client.lights.setLightLevel({ id, lightLevel: NIGHT_DEFAULTS.lightLevel });
            await sleep(100);
            await client.lights.setLightTemperature({ id, colorTemperature: NIGHT_DEFAULTS.colorTemperature });
            await sleep(100);
        }
    }
}

function getInitialDelay() {
    const now = new Date();
    const target = new Date();
    target.setHours(21, 0, 0, 0);

    // If past 9 PM today, set target to 9 PM tomorrow
    if (now > target) target.setDate(target.getDate() + 1);

    return target - now;
}

const initialDelay = getInitialDelay();
setTimeout(async () => {
    await makeEvening();
    setInterval(makeEvening, 24 * 60 * 60 * 1000); // Run every 24 hours
}, initialDelay);

// Listen for updates and adjust lights status
// Set default values if lights just came on
client.startListeningForUpdates(async (updateEvent) => {
    const { id: currentId, isReachable: updateIsReachable, attributes } = updateEvent.data || {};
    const isOn = attributes?.isOn ?? updateIsReachable;

    if (updateEvent.type === "deviceStateChanged" && currentId in LIGHTS) {
        const light = LIGHTS[currentId];

        if (updateIsReachable && isOn && (!light.isReachable || !light.isOn)) {
            const now = new Date();
            const isNightTime = now.getHours() >= 21;
            const defaults = isNightTime ? NIGHT_DEFAULTS : DAY_DEFAULTS;

            logWithTimestamp(`Setting ${isNightTime ? 'night' : 'day'} defaults for light ${currentId}`);
            await client.lights.setLightLevel({ id: currentId, lightLevel: defaults.lightLevel });
            await sleep(100);
            await client.lights.setLightTemperature({ id: currentId, colorTemperature: defaults.colorTemperature });
            await sleep(100);
        }

        if (updateIsReachable !== light.isReachable) {
            logWithTimestamp(`Light ${currentId} is reachable: ${light.isReachable} -> ${updateIsReachable}`)
            light.isReachable = updateIsReachable;
        }
        if (isOn !== light.isOn){
            logWithTimestamp(`Light ${currentId} is on: ${light.isOn} -> ${isOn}`)
            light.isOn = isOn;
        }
    }
});

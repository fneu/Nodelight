# Nodelight
When IKEA Tradfri lights are switched on via a wall switch, they revert to their previous brightness level, which might be undesirably low. This requires me to pull out my phone to adjust the brightness, adding unnecessary hassle to a simple action.

This script controls the lights by:

- Listening for Dirigera Hub Events: The script restores preferred brightness and color temperature settings automatically when lights are turned on, whether by app or wall switch.
- Evening Dimming: At 9 PM each day, Nodelight dims all active lights for evening ambiance.

# How to run

1. Obtain dirigera token by running `npx dirigera authenticate` ([github.com/lpgera/dirigera](https://github.com/lpgera/dirigera))
1. Set this as environment variable: `DIRIGERA_ACCESS_TOKEN`
1. Run `npm install` and `node main.mjs`

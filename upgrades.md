# Upgrades

Small things to clean up before calling this production-ready:

- move any local-only config into env vars and double-check the defaults
- add a basic health check for the server so deploys are easier to verify
- make failed API calls show a useful message instead of just going quiet
- add one empty state for when there is nothing to show yet
- run through the main flow on mobile once, mostly spacing and button reach
- trim any console logs that were only useful while building
- write down the exact start commands somewhere obvious
- do one clean install from scratch before shipping

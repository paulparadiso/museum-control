# frankontrol

Show control and other things

# Starting

Docker must be installed. Run 'docker compose up -d' from the the root directory.

This will start nginx, node-red, the MQTT broker, and any apps that are configured in apps/index.js. Nginx will serve the dashboard but the server app is nesessary to provide the graphQL interface between the dashboard and MQTT. This is necessary to view device statuses and control them from the dashboard.

# Creating new apps

New apps can be created by copying the EmptyApp directory and renaming the components and then adding the new app to the activeApps array in apps/index.js.
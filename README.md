﻿# PortableUTM WebApp
[![GitHub issues](https://img.shields.io/github/issues/portableutm/webapp)](https://github.com/portableutm/webapp/issues)
[![GitHub license](https://img.shields.io/github/license/portableutm/webapp)](https://github.com/portableutm/webapp/license)
![End-to-end tests](https://github.com/portableutm/webapp/workflows/End-to-end%20tests/badge.svg)

### What is PortableUTM?
PortableUTM is an ecosystem of products that has a clear objective: provide key actors with a reliable, highly-dependable, standards-compliant UTM solution for airspace management of [Unmanned Aerial Vehicles](https://en.wikipedia.org/wiki/Unmanned_aerial_vehicle), also knowns as RPAs or simply drones. 

As airspace is usually shared between commercial flights and UAVs, our system allows to be used in an ATC environment for supervision of flights while allowing critical situation monitoring and automatic notifications.

Our system is also specially recommended for the usage in emergency disaster response teams and is easy to use for UAV operators to share their telemetry. 

### What is the PortableUTM WebApp?
The WebApp (also known as **Ades**) is the main hub for authorities and pilots alike. It supports both the monitoring of all airspace under the control of the authority and the management for pilots and UAV operators of their shared data with authorities and request of new authorizations.

### How to use?
Assuming a valid and correctly configured instance of the PortableUTM USSCore, *consts.js* has an **API** field that should be pointed to this correct instance.
Then, **npm install** and **npm start** should do the magic.

### How to contribute?
Please refer to [the code of conduct](https://github.com/portableutm/webapp/blob/develop/CODE_OF_CONDUCT.md) and [the contribution guide](https://github.com/portableutm/webapp/blob/develop/CONTRIBUTING.md) 

### Main concepts
An **Operation** is the authorization request for a future flight to be performed by one or more pilots. By using the WebApp the pilot can define the various characteristics of the flight including Volume reservations, start and end time.

A system **Monitor** is an user that has the authority to view flight plans submitted, view a real-time map of aircraft in the air and receive important notifications generated by the system.

### Test suite
We use [Cypress](https://www.cypress.io/) for our end-to-end tests.
We try to stick with [its best practices](https://docs.cypress.io/guides/references/best-practices.html) as much as possible.
Our currently implemented tests include
*  dsh_list_users: performs common actions in the users lists.
*  dsh_newvehicle: creates a new vehicle and checks that it was created properly, as a Pilot user
*  dsh_sidemenu: tries out that all the buttons on the sidemenu of the dashboard execute properly
*  map_createnewoperation: creates a new operation setting each of its properties and deletes the newly created operation
*  map_layers: examines that the layer function is working properly
*  map_operations: tries out the list of operations
*  map_quickfly: mocks a list of quick flies and tries out that they're working
*  sp_login: logins with a correct user, then tries to log in with a incorrect user
*  sp_registration: registers a new user and fails for each field
*  sp_simulator: not meant to test the simulator, but to test the live drone position reporting feature

### LICENSE
PortableUTM WebApp is [MIT licensed](https://github.com/portableutm/webapp/blob/master/LICENSE)
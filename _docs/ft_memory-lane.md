# Feature Memory Lane Scaffolding
Goal: create a digital memory lane functionality for the guests to open their cameras and send their taken photos to wedstack.

We will display the photos in a gallery with infinite scroll and pagination that guests can access INSTANTLY and even download the photos and comment on them, just like we have in the messages page.

In order to access the picture taken by the guest, he will be required to add a passcode "SHARELOVE" in the interface. We'll offer 4 different options: "SHARELOVE", "LOVESTORY", "JUSTMARRIED25", "FOREVER21SEP"

BACKEND:
- [X] Create Photo model
- [X] Create photoTypes and add to typeDefs
- [X] Create Photo's Queries and Resolvers
- [X] Wire photo to resolvers in index.ts
- [X] Update .env variables
- [X] Hire and configure DigitalOcean's Spaces bucket for photos
- [X] Create Spaces service to create a way to upload photos to Spaces
- [ ] Add test coverage for photo queries and resolvers

FRONTEND:
- [X] Create gallery page, memory lane page and share love page
- [X] Create logic to upload photos to spaces using apollo + graphql
- [X] Add secret passcode to share love page
- [X] Create component gallery grid
- [X] Create component camera capture
- [X] Added infinite scroll and pagination to gallery grid
- [X] Make upload work - problems with CORS config at digital ocean
- [X] Fix 'public-read' issue at digital ocean by adding "x-amz-acl" header and "public-read" value
- [X] Fix "Invalid date" on frontend
- [X] Add a tag to display name + posted day/time below each photo
- [X] Clear cached images from spaces bucket
- [X] Add translations for memory lane and share love pages
- [ ] Add test coverage for memory lane and share love pages






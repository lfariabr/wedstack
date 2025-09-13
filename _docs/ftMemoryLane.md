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
- [X] Add pagination and infinite scroll to gallery grid
- [X] Adds flip camera button (switch between front and back camera - **if available**)
- [ ] Upgrade UX for guests to register moments by:
    - [ ] Add option for guest to upload from phone gallery 
    - [ ] Organize flow by deciding if:
        - we show only "Flip" button with the already existing camera
        - we keep showing both buttons, but fix the "Gallery" current button, that opens camera again, instead of asking user's permission to open Photo Gallery (on mobile only, because on the computer it correctly triggers open file upload dialog box)
    - [X] Hide the "Auto" select box that appears when accessing the website via mobile
    - [X] Make the button "Unlock camera" look more like a button, even add an emoji if that's the case.
    - [X] Make the button "Go to Memory Lane" look more like a button, even add an emoji if that's the case.
- [ ] Add test coverage for memory lane and share love pages






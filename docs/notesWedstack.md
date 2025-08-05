### DONE
**v1.1.0** - `feature/let-it-roll`
- installing project locally. Now running
- checking about .svg layout change supposed to be there. Worked.
- add requested buttons
- adjust layout look and feel

**v1.2.0** - `feature/content-viz`
- improves content viz light mode by adjusting opacity to 0.92
- updates .svg images with 2 new ones: opera and wedding ring
- cleans hero section content
- start trying to add circle text up there

**v1.3.0** - `fix/gitignore`
- make .gitignore public, except for frontend/public

**v1.4.0** - `feature/page-details`
- add custom svg background according to page name via `DynamicBackground.tsx` component
- create page details and set up content area for info
- add buttons to navigate to other pages / google maps

**v1.5.0** - `feature/page-menu`
- create page menu
- transcript menu content from pics
- adds new svg for menu background

**v1.6.0** - `feature/page-message`
- create page for sending message and reading sent messages
- refactor color structures according to requests
- adjusts more color based on feedback, custom variables

**v1.7.0** - `feature/page-gift`
- create page gift and mock up content
- implement handleCopy fn for cool UX

**v1.8.0** - `feature/backend-mongo`
- create a graphql query to post message to db
- create a graphql query to get message from db

**v1.8.0** - `feature/mongodb` - configure cluster and connect .env 
- configured Project and Cluster on MongoDB
- opened connection string to 0.0.0.0 for local connection
- redis command: `redis-server --port 6381 --daemonize yes`
- test message page with mongodb connection after:
    - updating queries, resolvers, types, hooks and mutations

### IN PROGRESS

### SPRINT

**v1.9.0** - `feature/stripe` - create stripe integration / pix / commonwealth payid .. explore
- add table "guests"
    - name, group, status (confirmed / pending)
    - add "confirm presence" button
    - extra: if one of group confirms, all group members are confirmed
- add page "confirm presence"
- add widget "CONFIRM PRESENCE"

### BACKLOG
- dark mode content viz
- update Jest tests coverage
- think about bestman / bridesmaid page
- think about adding reactions to messages
- think about adding possibility of updating page after message is sent + loading button

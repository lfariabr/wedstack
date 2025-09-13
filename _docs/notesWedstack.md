### DONE
**v1.1.0** ✅ - `feature/let-it-roll`
- installing project locally. Now running
- checking about .svg layout change supposed to be there. Worked.
- add requested buttons
- adjust layout look and feel

**v1.2.0** ✅ - `feature/content-viz`
- improves content viz light mode by adjusting opacity to 0.92
- updates .svg images with 2 new ones: opera and wedding ring
- cleans hero section content
- start trying to add circle text up there

**v1.3.0** ✅ - `fix/gitignore`
- make .gitignore public, except for frontend/public

**v1.4.0** ✅ - `feature/page-details`
- add custom svg background according to page name via `DynamicBackground.tsx` component
- create page details and set up content area for info
- add buttons to navigate to other pages / google maps

**v1.5.0** ✅ - `feature/page-menu`
- create page menu
- transcript menu content from pics
- adds new svg for menu background

**v1.6.0** ✅ - `feature/page-message`
- create page for sending message and reading sent messages
- refactor color structures according to requests
- adjusts more color based on feedback, custom variables

**v1.7.0** ✅ - `feature/page-gift`
- create page gift and mock up content
- implement handleCopy fn for cool UX

**v1.8.0** ✅ - `feature/backend-mongo`
- create a graphql query to post message to db
- create a graphql query to get message from db

**v1.8.0** ✅ - `feature/mongodb` - configure cluster and connect .env 
- configured Project and Cluster on MongoDB
- opened connection string to 0.0.0.0 for local connection
- redis command: `redis-server --port 6381 --daemonize yes`
- test message page with mongodb connection after:
    - updating queries, resolvers, types, hooks and mutations

**v2.0.0** ✅ - `feature/guests`
- add table "guests"
    - [X] name, phone, group, status (confirmed / pending) - done.
    - [X] prepare table to import guests on db using csv at `backend/scripts/wedstack_guestlist_v1.csv`
    - [X] create file `guestTypes.ts` at `backend/src/schemas/types/guestTypes.ts`
    - [X] create script to import guests from csv file (to be ran once) at `backend/scripts/importGuests.ts`
        - import Guest model
        - import db connection
        - read csv file
        - import guests to db
        - added a FANCY deduplication logic using redis

**v2.1.0** ✅ - `feature/guests-queries`
- [X] create graphql query to get guest from db (searching name, phone, group, status)
    - [X] create guests/queries.ts

**v2.2.0** ✅ - `feature/guests-mutations`
- [X] create a graphql mutation to update guest status, group and plusOnes (e.g. guest luis ticks that he confirms for him and 1 member of his family, other will be absent. Process this)
    - [X] create types on schema/guestTypes.ts and typeDefs.ts
    - [X] create guests/mutations.ts

**v2.3.0** ✅ - `feature/guests-ui`
- [X] add page "confirm presence"
- [X] add "confirm presence" button
- [X] add family members table
- [X] add actions buttons

**v2.4.0** ✅ - `feature/docker`
- [X] run docker backend with npm run dev on frontend
```bash
cd backend
docker-compose up -d
curl http://localhost:4000/graphql
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello }"}'
```
and
```bash
cd frontend
npm run dev
```
In your Codespaces interface:
1. Open Ports Panel: Press Ctrl+Shift+P → Type "Ports: Focus on Ports View"
2. Forward Port 4000: Click "Forward a Port" → Enter 4000
3. Set Visibility: Make it Public for external access

**v2.5.0** ✅ - `feature/layout-nana`
- [X] dark mode content remove
- [X] change content on home page
- [X] change colors on css and buttons colors

**v2.6.0** ✅ - `feature/guests-ux`
- [X] add widget "CONFIRM PRESENCE"
- [X] add more security for status changing (like re-typing guest name or phone) and block guest from changing status if already confirmed or absent

**v2.7.0** ✅ - `feature/navigation` 
- [X] quick refactor of confirm button presence, as it was bothering me
- [X] quick refactor of home buttons, font, etc... late minute requests
- [X] component "go to next page/ previous page"
- [X] add this navigation between details, menu, message, gifts, confirmation

**v3.1.0** ✅ - `feature/deploy` 
- [X] buy domain, buy server and configure server
- [X] point dns to server 100.20.22.151	
- [X] configure container and deploy to weddingln.com

**v3.2.0** ✅ - `feature/css-fine-tune` 
- [X] quick refactoring after stakeholders asked for unplanned changes (***she's the bride after all, rofml!!!***)

**v3.3.0** ✅ - `feature/layout-nana-2`
- [X] Page detalhes: text, color of box bg-[#F47EAB]/50, cardapio completo
- [X] Page menu: text, color of boxes bg-[#F9785F]/50 and bg-[#F47EAB]/50
- [X] Recadinhos: color of box bg-[#F47EAB]/50

**v3.4.0** ✅ - `feature/ptbr-en` ***("Component navegação cíclica")***
- [X] add feature to toggle PTBR/EN
- [X] create LangSwitcher.tsx
- [X] integrate on page navigation (added to header)
- [X] add content to pt.json and en.json
- [X] create simple `lib/i18n/I18nProvider.tsx`
- [X] import `I18nProvider` on `app/layout.tsx`
- [X] Tested and application running without errors
- [X] Update LangSwitcher to use i18n
- [X] Applies i18n to pages Home, Details, Menu, Message, Header, Confirmation (and sub-components), Gifts
- [X] Applies i18n to FamilyMembersTable, FamilyWelcomeCard, GuestSearchForm, GuestSelectionList, GuestVerification and LoadingStates

**v3.5.0** ✅ - `feature/confirmation-ux` 
- [X] allow guests to mark themslves as absent
- [X] create modal to confirm guest identity for absent guests
- [X] fix modal to mark absent on mobile (breaking)
- [X] don't allow guests to change their status. Once changed from pending to ANY state, others should be BLOCKED / NOT ABLE TO SELECT/SAVE
- [X] save and new search button's sizing

**v4.0.0** ✅ - `feature/stripe` 
- [X] create stripe account
- [X] create 4x products on stripe with desc and images
- [X] install stripe npm i stripe @stripe/stripe-js --legacy-peer-deps
- [X] lib/stripe/stripeClient.ts
- [X] add keys @.env.local
- [X] create stripe integration with button "PAGAR" on /gifts page
- [X] use MOST SIMPLE approach to plug in checkout allowing people to select product and pay
- [X] create thank you page functionality or page
- [X] check if payments are going through
- [X] create a thank you page

**v4.1.0** ✅ - `feature/hide-guests-phone`
- [X] replace first 3 digits of guest phone number on frontend with stars
- [X] update README.md
- [X] update .env.example to match stripe info

**v4.2.0** ✅ - `feature/protecting-phones`
- [X] close introspection on /graphql on index.ts

### IN PROGRESS

**v5.0.0** ✅ - `feature/memory-lane`
- [X] document the project throughly at `_docs/ft_memory-lane.md`
- [X] build backend: Photo model + DigitalOcean spaces and Spaces service to upload photos
- [X] build frontend: Apollo + graphql and powerful hooks using taylor-made components on next.js
- [ ] test coverage

### SPRINT
- n/a

### BACKLOG

**v5.x.x** 🔸 - `feature/message-reaction`
> Goal: add reactions to messages (like, love, etc...)

**Backend**
- [ ] Update backend schema (reactions: [String]!, ReactionCount and reactionCounts)
- [ ] Add mutation to add reaction to message
- [ ] validate emoji string and then push to reactions
- [ ] ensure existing queries already return reactions via lean doc
- [ ] implement simple server-side guardrails (small whitelist of emojis and max array size per message)

**Frontend**
- [ ] update graphQL queries adding reactions to fragment
- [ ] update hooks to use new queries
- [ ] UI update rendering reaction chips and counts

### IDEAS
- clean out frontend code (articles, projects, auth)
- update Jest tests coverage
- bestman / bridesmaid page

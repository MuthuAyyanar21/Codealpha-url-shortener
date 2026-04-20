CodeAlpha Backend Development — M1 Tasks
All three tasks use Node.js + Express.js + SQLite (via `better-sqlite3`).  
No external database setup required — SQLite files are created automatically on first run.
---
🚀 Quick Start (per task)
```bash
cd task1-url-shortener      # or task2-event-registration / task3-restaurant-management
npm install
npm start                   # or: npm run dev  (auto-restart with nodemon)
```
---
✅ Task 1 — Simple URL Shortener (Port 3001)
Features
Shorten any valid URL to a unique short code
Redirect short URLs → original URL (tracks visit count)
View stats per short code
Basic frontend at `GET /`
API Endpoints
Method	Endpoint	Description
GET	`/`	Frontend UI
POST	`/api/shorten`	Create short URL
GET	`/:code`	Redirect to original URL
GET	`/api/stats/:code`	View stats for a short code
GET	`/api/all`	List all shortened URLs
Example
```bash
# Shorten a URL
curl -X POST http://localhost:3001/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very/long/url"}'

# Response
{ "short_code": "a3f9c2b1", "short_url": "http://localhost:3001/a3f9c2b1", "original_url": "..." }

# Visit stats
curl http://localhost:3001/api/stats/a3f9c2b1
```
---
✅ Task 2 — Event Registration System (Port 3002)
Features
User registration & login (organizer / attendee roles)
Organizers can create, update, delete events
Attendees can register/cancel event registrations
Capacity enforcement (no overbooking)
View attendee list per event
API Endpoints
Users
Method	Endpoint	Description
POST	`/api/users/register`	Register a new user
POST	`/api/users/login`	Login
Events
Method	Endpoint	Description
GET	`/api/events`	List all events
GET	`/api/events/:id`	Event details
POST	`/api/events`	Create event (organizer)
PUT	`/api/events/:id`	Update event (organizer)
DELETE	`/api/events/:id`	Delete event (organizer)
Registrations
Method	Endpoint	Description
POST	`/api/registrations`	Register for an event
DELETE	`/api/registrations/:id`	Cancel registration
GET	`/api/users/:id/registrations`	User's registrations
GET	`/api/events/:id/registrations`	Event's attendees
Example
```bash
# Register a user (organizer)
curl -X POST http://localhost:3002/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@mail.com","password":"secret","role":"organizer"}'

# Create an event
curl -X POST http://localhost:3002/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Tech Meetup","event_date":"2025-09-01","organizer_id":1,"capacity":50}'

# Register an attendee for the event
curl -X POST http://localhost:3002/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"user_id":2,"event_id":1}'
```
---
✅ Task 3 — Restaurant Management System (Port 3003)
Features
Menu management with categories (CRUD)
Table management with status tracking (free / occupied / reserved)
Order creation with multiple items
Order status workflow: `pending → in-progress → served → paid`
Automatically updates table status when order is paid
Add items to existing orders
Daily sales report
API Endpoints
Menu
Method	Endpoint	Description
GET	`/api/menu`	List menu items (filter: `?category_id=&available=true`)
GET	`/api/menu/:id`	Single item detail
POST	`/api/menu`	Add menu item
PUT	`/api/menu/:id`	Update menu item
DELETE	`/api/menu/:id`	Delete menu item
GET	`/api/categories`	List categories
POST	`/api/categories`	Add category
Tables
Method	Endpoint	Description
GET	`/api/tables`	List all tables with status
PUT	`/api/tables/:id/status`	Update table status
Orders
Method	Endpoint	Description
GET	`/api/orders`	List orders (filter: `?status=pending`)
GET	`/api/orders/:id`	Order detail with items
POST	`/api/orders`	Create new order
PUT	`/api/orders/:id/status`	Update order status
POST	`/api/orders/:id/items`	Add item to existing order
Reports
Method	Endpoint	Description
GET	`/api/reports/sales`	Daily sales summary
Example
```bash
# Add a menu item
curl -X POST http://localhost:3003/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Margherita Pizza","price":12.99,"category_id":2}'

# Create an order for table 1
curl -X POST http://localhost:3003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"table_id":1,"items":[{"menu_item_id":1,"quantity":2}]}'

# Mark order as paid
curl -X PUT http://localhost:3003/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"paid"}'
```
---
📁 Project Structure
```
backend-project/
├── task1-url-shortener/
│   ├── server.js
│   └── package.json
├── task2-event-registration/
│   ├── server.js
│   └── package.json
└── task3-restaurant-management/
    ├── server.js
    └── package.json
```
🛠 Tech Stack
Runtime: Node.js
Framework: Express.js
Database: SQLite (via `better-sqlite3`)
No ORM — raw SQL for clarity and simplicity

# college-lost-found
AUTH

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/auth/profile

LOST

GET /api/lost
GET /api/lost/:id
POST /api/lost
PUT /api/lost/:id
DELETE /api/lost/:id

FOUND

GET /api/found
GET /api/found/:id
POST /api/found
PUT /api/found/:id
DELETE /api/found/:id

CLAIMS

POST /api/claims
GET /api/claims/my
GET /api/claims/received
PUT /api/claims/:id

DASHBOARD

GET /api/dashboard/stats
//demo
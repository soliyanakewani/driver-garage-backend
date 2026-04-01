# Insomnia API collections

Collections are grouped by **actor** (Driver, Garage, Admin) so you can import only what you need.

## Folder structure

```
docs/insomnia/
├── admin/
│   └── Admin-Garage-Approval.json  → Admin: login, list/search garages, approve, reject
├── driver/
│   └── Driver-API.json             → Driver: auth, profile, vehicles, appointments
├── garage/
│   ├── Garage-API.json             → Garage: auth, appointments (list/search/detail)
│   ├── Garage-All-Endpoints.json   → Garage: profile, services, availability, notifications, settings, ratings + appointment actions
│   └── TESTING.md                  → Step-by-step testing guide for all garage endpoints
└── README.md                       (this file)
```

## How to import

1. Open **Insomnia**.
2. **Application** → **Preferences** → **Data** → **Import Data** (or drag the JSON file).
3. Choose the collection you need:
   - **Admin (garage approval)** → import `admin/Admin-Garage-Approval.json`
   - **Driver app** → import `driver/Driver-API.json`
   - **Garage app** → import **both** `garage/Garage-API.json` and `garage/Garage-All-Endpoints.json`

Use **Garage - Local** for both garage collections. Use **Admin - Local** for the admin collection. For a full step-by-step test of every garage endpoint, see **`garage/TESTING.md`**.

---

## Driver API (`driver/Driver-API.json`)

**Workspace:** Driver API  
**Environment:** Driver - Local

| Variable        | Description |
|----------------|-------------|
| `base_url`     | `http://localhost:4000` (or your server URL) |
| `driver_token` | Set after **Driver Login** (copy `token` from response) |
| `vehicle_id`   | Set after **POST Create Vehicle** for GET/PUT/DELETE by ID |
| `appointment_id` | Set after **POST Book Appointment** for GET/PATCH by ID |

**Suggested order:**  
1. **Auth** → Driver Signup, then Driver Login (copy token to `driver_token`).  
2. **Vehicles** → Create, List, GET by ID, PUT Update, DELETE.  
3. **Profile** → GET, POST Create, PUT Update.  
4. **Appointments** → Book, List, GET by ID, Reschedule, Cancel.

All requests except Signup and Login need **Authorization:** `Bearer {{ _.driver_token }}`.

---

## Garage API (`garage/Garage-API.json`)

**Workspace:** Garage API  
**Environment:** Garage - Local

| Variable        | Description |
|----------------|-------------|
| `base_url`     | `http://localhost:4000` (or your server URL) |
| `garage_token` | Set after **Garage Login** (copy `token` from response) |
| `appointment_id` | Set after listing appointments, for GET by ID |

**Suggested order:**  
1. **Auth** → Garage Signup, then Garage Login and set `garage_token`.  
2. **Appointments** → GET list, GET search, GET by ID (set `appointment_id`).

All garage requests need **Authorization:** `Bearer {{ _.garage_token }}`.

---

## Garage API – All endpoints (`garage/Garage-All-Endpoints.json`)

**Workspace:** Garage API - Profile, Services, Availability, Notifications, Settings, Ratings  
**Environment:** Garage - Local (same as above; add `slot_id`, `service_id`, `rating_id` as needed)

Covers every other garage feature:

| Section    | Endpoints |
|-----------|-----------|
| **1. Profile** | GET /garage/profile, PUT /garage/profile |
| **2. Appointments** | GET /garages/appointments/history, PATCH …/approve, …/reject, …/status |
| **3. Availability** | GET/POST/PATCH/DELETE /garages/availability/me/slots |
| **4. Services** | GET/POST/PATCH/DELETE /garages/me/services |
| **5. Notifications** | GET /garages/notifications |
| **6. Settings** | GET/PUT /garages/settings |
| **7. Ratings** | GET /garages/ratings, GET /garages/ratings/:ratingId |

**Full step-by-step instructions:** see **`garage/TESTING.md`**.

---

## Admin – Garage Approval (`admin/Admin-Garage-Approval.json`)

**Workspace:** Admin - Garage Approval  
**Environment:** Admin - Local

| Variable      | Description |
|---------------|-------------|
| `base_url`    | `http://localhost:4000` (or your server URL) |
| `admin_token` | Set after **Admin Login** (copy `token` from response) |
| `garage_id`   | Set when approving/rejecting (copy from garage signup or from GET list/search) |

**Suggested order:**  
1. **Auth** → Admin Login (use your admin email/password); copy `token` into `admin_token`.  
2. **Garage Approval** → GET Search Garages (PENDING) to see new garages; copy one garage `id` into `garage_id`; then **POST Approve Garage** (or POST Reject Garage).  
3. Optional: GET All Garages, GET Garage by ID.

All admin requests (except Login) need **Authorization:** `Bearer {{ _.admin_token }}`.  
Use this collection to approve garages so drivers can book appointments with them (see **`garage/TESTING.md`** → Garage approval).

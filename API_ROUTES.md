# PincodeHub API - Complete Route Documentation

## Base URL
```
http://localhost:5000
```

---

## 1. Get All States
```
GET /api/states
```

**Response:**
```json
[
  "ANDAMAN & NICOBAR ISLANDS",
  "ANDHRA PRADESH",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHHATTISGARH",
  "DADAR & NAGAR HAVELI",
  "DAMAN & DIU",
  "DELHI",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JAMMU & KASHMIR",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "LAKSHADWEEP",
  "MADHYA PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ODISHA",
  "PONDICHERRY",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL"
]
```

**React Usage:**
- Populate State Dropdown (FilterPanel)
- Used in /explore page on load
- Browse State section in home page

---

## 2. Search by Pincode
```
GET /api/pincode/:pincode
```

**Example:** `GET /api/pincode/380001`

**Response:**
```json
[
  {
    "pincode": "380001",
    "officeName": "Ahmedabad G.P.O.",
    "officeType": "H.O",
    "deliveryStatus": "Delivery",
    "districtName": "Ahmedabad",
    "stateName": "GUJARAT",
    "cityName": "Ahmedabad",
    "regionName": "Ahmedabad HQ",
    "divisionName": "Ahmedabad City",
    "circleName": "Gujarat",
    "taluk": "Ahmadabad City"
  }
]
```

**React Usage:**
- Search Pincode section in home page
- Pincode lookup page (/pincode)
- Returns array of matching offices

---

## 3. Get Districts by State
```
GET /api/states/:state/districts
```

**Example:** `GET /api/states/TAMIL%20NADU/districts`

**Response:**
```json
[
  "Ariyalur",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Salem",
  "Sivaganga",
  "Thanjavur",
  "Theni",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Tuticorin",
  "Vellore",
  "Villupuram",
  "Virudhunagar"
]
```

**React Usage:**
- Browse District section in home page
- Populate district filter dropdown
- Filter pincodes by state

---

## 4. Get Cities/Districts by State & District
```
GET /api/states/:state/districts/:district/taluks
```

**Example:** `GET /api/states/TAMIL%20NADU/districts/Chennai/taluks`

**Response:**
```json
[
  "Taluk1",
  "Taluk2",
  "Taluk3"
]
```

**React Usage:**
- Browse by district with taluk filtering
- Secondary filtering in Explore page

---

## 5. Get Districts (All)
```
GET /api/districts
```

**Response:**
```json
[
  "Adilabad",
  "Agra",
  "Ahmednagar",
  "Aizawl",
  ...
]
```

**React Usage:**
- Browse District section initialization
- Populate district dropdown

---

## 6. Get Pincodes (Paginated)
```
GET /api/pincodes?page=1&limit=20
```

**Query Parameters:**
- `page` (optional, default=1): Page number
- `limit` (optional, default=20, max=50): Records per page

**Response:**
```json
{
  "data": [
    {
      "pincode": "110001",
      "officeName": "New Delhi GPO",
      "stateName": "DELHI",
      "districtName": "Delhi",
      "deliveryStatus": "Delivery"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 154706,
    "totalPages": 7736
  }
}
```

**React Usage:**
- Explore page pagination
- Load pincodes with offset

---

## 7. Search Pincodes
```
GET /api/search?q=delhi&limit=20
```

**Query Parameters:**
- `q` (required): Search query (city, district, state, office name)
- `limit` (optional, default=20): Max results

**Response:**
```json
{
  "records": [
    {
      "pincode": "110001",
      "officeName": "Delhi GPO",
      "stateName": "DELHI",
      "districtName": "Delhi",
      "cityName": "New Delhi",
      "deliveryStatus": "Delivery"
    }
  ],
  "total": 150
}
```

**React Usage:**
- Global search functionality
- Explore page search bar
- Real-time filtering

---

## 8. Get Statistics
```
GET /api/stats
```

**Response:**
```json
{
  "totalPincodes": 19093,
  "totalStates": 40,
  "deliveryOffices": 100000,
  "nonDeliveryOffices": 54706
}
```

**React Usage:**
- Dashboard statistics cards
- Overview metrics

---

## 9. Get State Distribution Stats
```
GET /api/stats/state-distribution
```

**Response:**
```json
[
  {
    "_id": "UTTAR PRADESH",
    "count": 5000
  },
  {
    "_id": "MAHARASHTRA",
    "count": 4500
  },
  {
    "_id": "TAMIL NADU",
    "count": 3200
  }
]
```

**React Usage:**
- Dashboard state-wise distribution chart
- Bar chart visualization

---

## 10. Get Delivery Distribution Stats
```
GET /api/stats/delivery-distribution
```

**Response:**
```json
[
  {
    "_id": "Delivery",
    "count": 100000
  },
  {
    "_id": "Non-Delivery",
    "count": 54706
  }
]
```

**React Usage:**
- Dashboard delivery status pie chart
- Donut chart visualization

---

## Map Routes (Interactive Map)

### Get Map State Details
```
GET /map/states/:state?page=1&limit=12
```

**Example:** `GET /map/states/TAMIL%20NADU?page=1&limit=12`

**Response:**
```json
{
  "state": "TAMIL NADU",
  "records": [
    {
      "pincode": "612904",
      "stateName": "TAMIL NADU",
      "districtName": "Ariyalur",
      "taluk": "Ariyalur",
      "cityName": "Idanganni B.O",
      "officeName": "Idanganni B.O",
      "officeType": "B.O",
      "deliveryStatus": "Delivery",
      "regionName": "Tiruchy",
      "divisionName": "Tiruchirapalli",
      "circleName": "Tamilnadu"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 5,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

**React Usage:**
- Interactive map click handler
- Display state pincodes with pagination
- Load featured record from state

---

## Helper Routes (Cities by State)

### Get Cities by State
```
GET /states/:state/cities
```

**Example:** `GET /states/TAMIL%20NADU/cities`

**Response:**
```json
[
  "Ariyalur",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  ...
]
```

**React Usage:**
- Browse state pincodes
- Populate city/district dropdown

---

## Error Handling

All endpoints return appropriate HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success - Data retrieved |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Database or processing error |

**Error Response Format:**
```json
{
  "error": "Error message describing what went wrong",
  "status": 400
}
```

---

## Testing in Postman

1. **Import Test Collection:**
   - Create new request for each endpoint above
   - Use GET method
   - Add query parameters as needed
   - Send request to test

2. **Example Tests:**
   - `GET http://localhost:5000/api/states` → Get all 40 states
   - `GET http://localhost:5000/api/pincode/380001` → Search pincode
   - `GET http://localhost:5000/api/stats` → Get statistics
   - `GET http://localhost:5000/map/states/TAMIL%20NADU` → Get map data

---

## Complete API Summary

| # | Method | Endpoint | Purpose |
|----|--------|----------|---------|
| 1 | GET | /api/states | Get all states |
| 2 | GET | /api/pincode/:pincode | Search by pincode |
| 3 | GET | /api/states/:state/districts | Get districts of state |
| 4 | GET | /api/states/:state/districts/:district/taluks | Get taluks of district |
| 5 | GET | /api/districts | Get all districts |
| 6 | GET | /api/pincodes | Get paginated pincodes |
| 7 | GET | /api/search | Search pincodes/cities |
| 8 | GET | /api/stats | Get statistics |
| 9 | GET | /api/stats/state-distribution | Get state-wise stats |
| 10 | GET | /api/stats/delivery-distribution | Get delivery stats |

**Additional Routes:**
- GET /map/states/:state - Map state details
- GET /states/:state/cities - Get cities by state

---

## Database Info

- **Total Records:** 154,706
- **Unique Pincodes:** 19,093
- **States/UTs:** 40
- **Collection:** task_mongo
- **Database:** pincode_hub (MongoDB Atlas)

All routes are **100% working** and tested! ✅

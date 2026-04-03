require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));
app.use(express.json());

const STATE_FIELDS = ["state", "stateName", "stateName                                       "];
const DISTRICT_FIELDS = ["districtName", "district", "city"];
const CITY_FIELDS = ["city", "officeName", "taluk", "districtName"];
const OFFICE_FIELDS = ["officeName", "office", "city", "districtName"];
const PINCODE_FIELDS = ["pincode"];

const buildFieldFallback = (fields) =>
    fields.reduceRight((fallback, field) => ({ $ifNull: [`$${field}`, fallback] }), "");

const buildTrimmedFieldExpression = (fields) => ({
    $trim: {
        input: {
            $toString: buildFieldFallback(fields)
        }
    }
});

const buildNormalizedStateExpression = () => ({
    $toUpper: {
        $trim: {
            input: {
                $toString: buildFieldFallback(STATE_FIELDS)
            }
        }
    }
});

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// 📦 Schema (flexible to capture all fields)
const PincodeSchema = new mongoose.Schema({}, { 
    collection: "task_mongo",
    strict: false
}); // 👈 Captures all fields from database

const Pincode = mongoose.model("Pincode", PincodeSchema);


// ================= API 1 =================
// 🔍 Get city by pincode
app.get("/api/pincode/:code", async (req, res) => {
    try {
        const trimmedCode = String(req.params.code || "").trim();
        const numericCode = Number(trimmedCode);
        const filters = [{ pincode: trimmedCode }];

        if (!Number.isNaN(numericCode)) {
            filters.push({ pincode: numericCode });
        }

        const data = await Pincode.find({ $or: filters }).lean();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= API 2 =================
// 📍 Get all states
app.get("/states", async (req, res) => {
    try {
        const states = await Pincode.aggregate([
            {
                $project: {
                    state: buildNormalizedStateExpression()
                }
            },
            {
                $match: {
                    state: { $ne: "" }
                }
            },
            {
                $group: {
                    _id: "$state"
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        res.json(states.map(({ _id }) => _id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= API 2B =================
// Interactive map state details with pagination
app.get("/map/states/:state", async (req, res) => {
    try {
        const normalizedState = String(req.params.state || "").trim().toUpperCase();
        const parsedPage = Number.parseInt(req.query.page, 10);
        const parsedLimit = Number.parseInt(req.query.limit, 10);
        const page = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);
        const limit = Number.isNaN(parsedLimit) ? 12 : Math.min(Math.max(parsedLimit, 1), 24);
        const skip = (page - 1) * limit;

        const [mapData] = await Pincode.aggregate([
            {
                $addFields: {
                    normalizedState: buildNormalizedStateExpression(),
                    stateDisplay: buildTrimmedFieldExpression(STATE_FIELDS),
                    districtDisplay: buildTrimmedFieldExpression(DISTRICT_FIELDS),
                    cityDisplay: buildTrimmedFieldExpression(CITY_FIELDS),
                    officeDisplay: buildTrimmedFieldExpression(OFFICE_FIELDS),
                    pincodeDisplay: buildTrimmedFieldExpression(PINCODE_FIELDS)
                }
            },
            {
                $match: {
                    normalizedState
                }
            },
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: "$normalizedState",
                                totalRecords: { $sum: 1 },
                                districts: { $addToSet: "$districtDisplay" },
                                cities: { $addToSet: "$cityDisplay" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalRecords: 1,
                                totalDistricts: {
                                    $size: {
                                        $filter: {
                                            input: "$districts",
                                            as: "district",
                                            cond: { $ne: ["$$district", ""] }
                                        }
                                    }
                                },
                                totalCities: {
                                    $size: {
                                        $filter: {
                                            input: "$cities",
                                            as: "city",
                                            cond: { $ne: ["$$city", ""] }
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    records: [
                        {
                            $sort: {
                                districtDisplay: 1,
                                cityDisplay: 1,
                                pincodeDisplay: 1
                            }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                        {
                            $project: {
                                _id: 0,
                                pincode: "$pincodeDisplay",
                                stateName: {
                                    $cond: [
                                        { $ne: ["$stateDisplay", ""] },
                                        "$stateDisplay",
                                        normalizedState
                                    ]
                                },
                                districtName: {
                                    $cond: [
                                        { $ne: ["$districtDisplay", ""] },
                                        "$districtDisplay",
                                        "N/A"
                                    ]
                                },
                                cityName: {
                                    $cond: [
                                        { $ne: ["$cityDisplay", ""] },
                                        "$cityDisplay",
                                        {
                                            $cond: [
                                                { $ne: ["$officeDisplay", ""] },
                                                "$officeDisplay",
                                                "N/A"
                                            ]
                                        }
                                    ]
                                },
                                officeName: {
                                    $cond: [
                                        { $ne: ["$officeDisplay", ""] },
                                        "$officeDisplay",
                                        "N/A"
                                    ]
                                },
                                officeType: 1,
                                deliveryStatus: 1,
                                regionName: 1,
                                divisionName: 1,
                                circleName: 1,
                                taluk: 1
                            }
                        }
                    ]
                }
            }
        ]);

        const summary = mapData?.summary?.[0] || {
            totalRecords: 0,
            totalDistricts: 0,
            totalCities: 0
        };
        const totalPages = summary.totalRecords > 0 ? Math.ceil(summary.totalRecords / limit) : 0;

        res.json({
            state: normalizedState,
            records: mapData?.records || [],
            summary,
            pagination: {
                page,
                limit,
                totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= API 3 =================
// 🏙️ Get cities by state
app.get("/states/:state", async (req, res) => {
    try {
        const normalizedState = String(req.params.state || "").trim().toUpperCase();
        const cities = await Pincode.aggregate([
            {
                $addFields: {
                    normalizedState: buildNormalizedStateExpression()
                }
            },
            {
                $match: {
                    normalizedState
                }
            },
            {
                $project: {
                    normalizedState: 0
                }
            }
        ]);

        res.json(cities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= DEBUG API =================
// 📊 Get total count & sample data
app.get("/debug/count", async (req, res) => {
    try {
        const count = await Pincode.countDocuments();
        const sample = await Pincode.findOne();
        res.json({ 
            totalRecords: count, 
            sampleData: sample,
            message: `Total ${count} records in collection`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📊 Search all pincodes (limited to first 10)
app.get("/debug/all", async (req, res) => {
    try {
        const data = await Pincode.find().limit(10);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= API 4 =================
// 🏘️ Get all districts
app.get("/districts", async (req, res) => {
    try {
        const districts = await Pincode.distinct("districtName");
        const sorted = districts.filter(d => d).sort();
        res.json(sorted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= API 5 =================
// 🏘️ Get all cities/pincodes in a district
app.get("/districts/:district", async (req, res) => {
    try {
        const district = String(req.params.district || "").trim();
        const pincodes = await Pincode.find({ districtName: district }).lean();
        res.json(pincodes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= API 6 =================
// 📊 Get all unique cities by state and district
app.get("/states/:state/cities", async (req, res) => {
    try {
        const state = String(req.params.state || "").trim().toUpperCase();
        const cities = await Pincode.aggregate([
            {
                $addFields: {
                    normalizedState: buildNormalizedStateExpression()
                }
            },
            {
                $match: {
                    normalizedState: state,
                    districtName: { $exists: true, $ne: "" }
                }
            },
            {
                $group: {
                    _id: "$districtName"
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        res.json(cities.map(c => c._id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🚀 Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

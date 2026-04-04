require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  })
);
app.use(express.json());

const COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME || "task_mongo";
const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

const STATE_FIELDS = ["state", "stateName", "stateName                                       "];
const DISTRICT_FIELDS = ["districtName", "district", "city"];
const TALUK_FIELDS = ["taluk"];
const CITY_FIELDS = ["city", "officeName", "taluk", "districtName"];
const OFFICE_FIELDS = ["officeName", "office", "city", "districtName"];
const PINCODE_FIELDS = ["pincode"];
const DELIVERY_FIELDS = ["deliveryStatus"];
const OFFICE_TYPE_FIELDS = ["officeType"];
const REGION_FIELDS = ["regionName"];
const DIVISION_FIELDS = ["divisionName"];
const CIRCLE_FIELDS = ["circleName"];

const buildFieldFallback = (fields) =>
  fields.reduceRight((fallback, field) => ({ $ifNull: [`$${field}`, fallback] }), "");

const buildTrimmedFieldExpression = (fields) => ({
  $trim: {
    input: {
      $toString: buildFieldFallback(fields),
    },
  },
});

const buildNormalizedFieldExpression = (fields) => ({
  $toUpper: {
    $trim: {
      input: {
        $toString: buildFieldFallback(fields),
      },
    },
  },
});

const buildNormalizedStateExpression = () => buildNormalizedFieldExpression(STATE_FIELDS);

const buildBaseRecordFields = () => ({
  normalizedState: buildNormalizedStateExpression(),
  normalizedDistrict: buildNormalizedFieldExpression(DISTRICT_FIELDS),
  normalizedTaluk: buildNormalizedFieldExpression(TALUK_FIELDS),
  normalizedDelivery: buildNormalizedFieldExpression(DELIVERY_FIELDS),
  stateDisplay: buildTrimmedFieldExpression(STATE_FIELDS),
  districtDisplay: buildTrimmedFieldExpression(DISTRICT_FIELDS),
  talukDisplay: buildTrimmedFieldExpression(TALUK_FIELDS),
  cityDisplay: buildTrimmedFieldExpression(CITY_FIELDS),
  officeDisplay: buildTrimmedFieldExpression(OFFICE_FIELDS),
  pincodeDisplay: buildTrimmedFieldExpression(PINCODE_FIELDS),
  deliveryDisplay: buildTrimmedFieldExpression(DELIVERY_FIELDS),
  officeTypeDisplay: buildTrimmedFieldExpression(OFFICE_TYPE_FIELDS),
  regionDisplay: buildTrimmedFieldExpression(REGION_FIELDS),
  divisionDisplay: buildTrimmedFieldExpression(DIVISION_FIELDS),
  circleDisplay: buildTrimmedFieldExpression(CIRCLE_FIELDS),
});

const buildRecordProjection = (fallbackState = "$normalizedState") => ({
  _id: 0,
  pincode: "$pincodeDisplay",
  stateName: {
    $cond: [{ $ne: ["$stateDisplay", ""] }, "$stateDisplay", fallbackState],
  },
  districtName: {
    $cond: [{ $ne: ["$districtDisplay", ""] }, "$districtDisplay", "N/A"],
  },
  taluk: {
    $cond: [{ $ne: ["$talukDisplay", ""] }, "$talukDisplay", "N/A"],
  },
  cityName: {
    $cond: [
      { $ne: ["$cityDisplay", ""] },
      "$cityDisplay",
      {
        $cond: [{ $ne: ["$officeDisplay", ""] }, "$officeDisplay", "N/A"],
      },
    ],
  },
  officeName: {
    $cond: [{ $ne: ["$officeDisplay", ""] }, "$officeDisplay", "N/A"],
  },
  officeType: {
    $cond: [{ $ne: ["$officeTypeDisplay", ""] }, "$officeTypeDisplay", "N/A"],
  },
  deliveryStatus: {
    $cond: [{ $ne: ["$deliveryDisplay", ""] }, "$deliveryDisplay", "N/A"],
  },
  regionName: {
    $cond: [{ $ne: ["$regionDisplay", ""] }, "$regionDisplay", "N/A"],
  },
  divisionName: {
    $cond: [{ $ne: ["$divisionDisplay", ""] }, "$divisionDisplay", "N/A"],
  },
  circleName: {
    $cond: [{ $ne: ["$circleDisplay", ""] }, "$circleDisplay", "N/A"],
  },
});

const buildDeliveryBucketExpression = () => ({
  $cond: [
    { $regexMatch: { input: "$normalizedDelivery", regex: /NON/i } },
    "nonDelivery",
    {
      $cond: [
        { $regexMatch: { input: "$normalizedDelivery", regex: /DELIVERY/i } },
        "delivery",
        "nonDelivery",
      ],
    },
  ],
});

const normalizeParamValue = (value) => String(value || "").trim().toUpperCase();

const STATE_NAME_MAPPING = {
  "CHATTISGARH": "CHHATTISGARH",
  "ANDAMAN & NICOBA": "ANDAMAN AND NICOBAR ISLANDS",
  "ANDAMAN NICOBAR": "ANDAMAN AND NICOBAR ISLANDS",
  "ANDHRA PR": "ANDHRA PRADESH",
  "ANDHRA PRA": "ANDHRA PRADESH",
  "ANDHRA PRADE": "ANDHRA PRADESH",
  "WEST": "WEST BENGAL",
  "JAMMU & KASHMIR": "JAMMU AND KASHMIR",
  "JAMMU KASHMIR": "JAMMU AND KASHMIR",
  "DADRA & NAGAR HAVELI": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "DAMAN & DIU": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "ORISSA": "ODISHA",
  "PONDICHERRY": "PUDUCHERRY",
  "UTTARANCHAL": "UTTARAKHAND",
};

const normalizeStateName = (state) => {
  const normalized = normalizeParamValue(state);
  return STATE_NAME_MAPPING[normalized] || normalized;
};

const parsePageValue = (value, fallback = 1) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? fallback : Math.max(parsedValue, 1);
};

const parseLimitValue = (value, fallback = DEFAULT_PAGE_SIZE) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return fallback;
  }

  return Math.min(Math.max(parsedValue, 1), MAX_PAGE_SIZE);
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildFilterMatch = ({ state, district, taluk }) => {
  const match = {};

  if (state) {
    match.normalizedState = normalizeStateName(state);
  }

  if (district) {
    match.normalizedDistrict = normalizeParamValue(district);
  }

  if (taluk) {
    match.normalizedTaluk = normalizeParamValue(taluk);
  }

  return match;
};

const buildSearchMatch = (query) => {
  const trimmedQuery = String(query || "").trim();

  if (!trimmedQuery) {
    return null;
  }

  const safeRegex = new RegExp(escapeRegex(trimmedQuery), "i");

  return {
    $or: [
      { pincodeDisplay: safeRegex },
      { officeDisplay: safeRegex },
      { cityDisplay: safeRegex },
      { districtDisplay: safeRegex },
      { talukDisplay: safeRegex },
      { stateDisplay: safeRegex },
    ],
  };
};

const buildStandardSort = () => ({
  normalizedState: 1,
  districtDisplay: 1,
  talukDisplay: 1,
  pincodeDisplay: 1,
  officeDisplay: 1,
});

const serializeCsvValue = (value) => {
  const normalizedValue = String(value ?? "");
  const escapedValue = normalizedValue.replace(/"/g, "\"\"");
  return `"${escapedValue}"`;
};

const createCsvContent = (rows) => {
  const headers = [
    "Pincode",
    "State",
    "District",
    "Taluk",
    "City",
    "Office",
    "Office Type",
    "Delivery Status",
    "Region",
    "Division",
    "Circle",
  ];

  const csvRows = rows.map((row) =>
    [
      row.pincode,
      row.stateName,
      row.districtName,
      row.taluk,
      row.cityName,
      row.officeName,
      row.officeType,
      row.deliveryStatus,
      row.regionName,
      row.divisionName,
      row.circleName,
    ]
      .map(serializeCsvValue)
      .join(",")
  );

  return `\uFEFF${headers.join(",")}\n${csvRows.join("\n")}`;
};

async function getAllStatesList() {
  const states = await Pincode.aggregate([
    {
      $project: {
        state: buildNormalizedStateExpression(),
      },
    },
    {
      $match: {
        state: { $ne: "" },
      },
    },
    {
      $group: {
        _id: "$state",
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const uniqueStates = new Set();
  states.forEach(({ _id }) => {
    const normalized = normalizeStateName(_id);
    if (normalized && normalized.trim()) {
      uniqueStates.add(normalized);
    }
  });

  return Array.from(uniqueStates).sort();
}

async function getDeliveryDistributionCounts() {
  const counts = await Pincode.aggregate([
    {
      $addFields: {
        ...buildBaseRecordFields(),
        deliveryBucket: buildDeliveryBucketExpression(),
      },
    },
    {
      $group: {
        _id: "$deliveryBucket",
        count: { $sum: 1 },
      },
    },
  ]);

  return counts.reduce(
    (distribution, item) => {
      if (item._id === "delivery") {
        distribution.delivery = item.count;
      }

      if (item._id === "nonDelivery") {
        distribution.nonDelivery = item.count;
      }

      return distribution;
    },
    { delivery: 0, nonDelivery: 0 }
  );
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

const PincodeSchema = new mongoose.Schema(
  {},
  {
    collection: COLLECTION_NAME,
    strict: false,
  }
);

const Pincode = mongoose.model("Pincode", PincodeSchema);

app.get("/api/pincode/:pincode", async (req, res) => {
  try {
    const trimmedCode = String(req.params.pincode || "").trim();
    const numericCode = Number(trimmedCode);
    const filters = [{ pincode: trimmedCode }];

    if (!Number.isNaN(numericCode)) {
      filters.push({ pincode: numericCode });
    }

    const data = await Pincode.find({ $or: filters }).lean();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/states", async (_req, res) => {
  try {
    res.json(await getAllStatesList());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/states/:state/districts", async (req, res) => {
  try {
    const normalizedState = normalizeParamValue(req.params.state);

    const districts = await Pincode.aggregate([
      {
        $addFields: buildBaseRecordFields(),
      },
      {
        $match: {
          normalizedState,
          normalizedDistrict: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$normalizedDistrict",
          name: { $first: "$districtDisplay" },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $cond: [{ $ne: ["$name", ""] }, "$name", "$_id"],
          },
        },
      },
    ]);

    res.json(districts.map(({ name }) => name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/states/:state/districts/:district/taluks", async (req, res) => {
  try {
    const normalizedState = normalizeParamValue(req.params.state);
    const normalizedDistrict = normalizeParamValue(req.params.district);

    const taluks = await Pincode.aggregate([
      {
        $addFields: buildBaseRecordFields(),
      },
      {
        $match: {
          normalizedState,
          normalizedDistrict,
          normalizedTaluk: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$normalizedTaluk",
          name: { $first: "$talukDisplay" },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $cond: [{ $ne: ["$name", ""] }, "$name", "$_id"],
          },
        },
      },
    ]);

    res.json(taluks.map(({ name }) => name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/pincodes", async (req, res) => {
  try {
    const page = parsePageValue(req.query.page, 1);
    const limit = parseLimitValue(req.query.limit, DEFAULT_PAGE_SIZE);
    const skip = (page - 1) * limit;
    const filterMatch = buildFilterMatch(req.query);
    const searchMatch = buildSearchMatch(req.query.q);
    const projection = buildRecordProjection("$normalizedState");

    const pipeline = [
      {
        $addFields: buildBaseRecordFields(),
      },
    ];

    if (Object.keys(filterMatch).length > 0) {
      pipeline.push({ $match: filterMatch });
    }

    if (searchMatch) {
      pipeline.push({ $match: searchMatch });
    }

    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          {
            $sort: buildStandardSort(),
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $project: projection,
          },
        ],
      },
    });

    const [result] = await Pincode.aggregate(pipeline);
    const total = result?.metadata?.[0]?.total || 0;

    res.json({
      data: result?.data || [],
      total,
      page,
      limit,
      totalPages: total > 0 ? Math.ceil(total / limit) : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const trimmedQuery = String(req.query.q || "").trim();

    if (!trimmedQuery) {
      res.json({ query: "", suggestions: [], data: [] });
      return;
    }

    const searchMatch = buildSearchMatch(trimmedQuery);
    const projection = buildRecordProjection("$normalizedState");

    const [result] = await Pincode.aggregate([
      {
        $addFields: buildBaseRecordFields(),
      },
      {
        $match: searchMatch,
      },
      {
        $facet: {
          suggestions: [
            {
              $sort: buildStandardSort(),
            },
            {
              $limit: 8,
            },
            {
              $project: projection,
            },
          ],
          data: [
            {
              $sort: buildStandardSort(),
            },
            {
              $limit: 20,
            },
            {
              $project: projection,
            },
          ],
        },
      },
    ]);

    const suggestions = (result?.suggestions || []).map((item) => ({
      id: `${item.pincode}-${item.officeName}-${item.districtName}`,
      label: `${item.officeName} • ${item.districtName} • ${item.stateName}`,
      queryValue:
        item.pincode && item.pincode !== "N/A" ? item.pincode : item.officeName,
      pincode: item.pincode,
      stateName: item.stateName,
      districtName: item.districtName,
      taluk: item.taluk,
      officeName: item.officeName,
    }));

    res.json({
      query: trimmedQuery,
      suggestions,
      data: result?.data || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stats/state-distribution", async (_req, res) => {
  try {
    const distribution = await Pincode.aggregate([
      {
        $addFields: buildBaseRecordFields(),
      },
      {
        $match: {
          normalizedState: { $ne: "" },
          pincodeDisplay: { $ne: "" },
        },
      },
      {
        $group: {
          _id: {
            state: "$normalizedState",
            pincode: "$pincodeDisplay",
          },
        },
      },
      {
        $group: {
          _id: "$_id.state",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          state: "$_id",
          count: 1,
        },
      },
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stats/delivery-distribution", async (_req, res) => {
  try {
    res.json(await getDeliveryDistributionCounts());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stats", async (_req, res) => {
  try {
    const [pincodeCountResult, states, deliveryDistribution] = await Promise.all([
      Pincode.aggregate([
        {
          $addFields: buildBaseRecordFields(),
        },
        {
          $match: {
            pincodeDisplay: { $ne: "" },
          },
        },
        {
          $group: {
            _id: "$pincodeDisplay",
          },
        },
        {
          $count: "total",
        },
      ]),
      getAllStatesList(),
      getDeliveryDistributionCounts(),
    ]);

    res.json({
      totalPincodes: pincodeCountResult?.[0]?.total || 0,
      totalStates: states.length,
      deliveryOffices: deliveryDistribution.delivery,
      nonDeliveryOffices: deliveryDistribution.nonDelivery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/export", async (req, res) => {
  try {
    const filterMatch = buildFilterMatch(req.query);
    const searchMatch = buildSearchMatch(req.query.q);
    const projection = buildRecordProjection("$normalizedState");

    const pipeline = [
      {
        $addFields: buildBaseRecordFields(),
      },
    ];

    if (Object.keys(filterMatch).length > 0) {
      pipeline.push({ $match: filterMatch });
    }

    if (searchMatch) {
      pipeline.push({ $match: searchMatch });
    }

    pipeline.push(
      {
        $sort: buildStandardSort(),
      },
      {
        $project: projection,
      }
    );

    const rows = await Pincode.aggregate(pipeline);
    const csvContent = createCsvContent(rows);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="pincode-export.csv"'
    );
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/states", async (_req, res) => {
  try {
    res.json(await getAllStatesList());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/map/states/:state", async (req, res) => {
  try {
    const normalizedState = normalizeParamValue(req.params.state);
    const page = parsePageValue(req.query.page, 1);
    const limit = Math.min(parseLimitValue(req.query.limit, 12), 24);
    const skip = (page - 1) * limit;
    const projection = buildRecordProjection(normalizedState);

    const [mapData] = await Pincode.aggregate([
      {
        $addFields: buildBaseRecordFields(),
      },
      {
        $match: {
          normalizedState,
        },
      },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: "$normalizedState",
                totalRecords: { $sum: 1 },
                districts: { $addToSet: "$districtDisplay" },
                cities: { $addToSet: "$cityDisplay" },
              },
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
                      cond: { $ne: ["$$district", ""] },
                    },
                  },
                },
                totalCities: {
                  $size: {
                    $filter: {
                      input: "$cities",
                      as: "city",
                      cond: { $ne: ["$$city", ""] },
                    },
                  },
                },
              },
            },
          ],
          records: [
            {
              $sort: buildStandardSort(),
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $project: projection,
            },
          ],
          featuredRecord: [
            {
              $sort: buildStandardSort(),
            },
            {
              $limit: 1,
            },
            {
              $project: projection,
            },
          ],
          districtPreview: [
            {
              $match: {
                districtDisplay: { $ne: "" },
              },
            },
            {
              $group: {
                _id: "$districtDisplay",
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
            {
              $limit: 8,
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
              },
            },
          ],
        },
      },
    ]);

    const summary = mapData?.summary?.[0] || {
      totalRecords: 0,
      totalDistricts: 0,
      totalCities: 0,
    };
    const totalPages =
      summary.totalRecords > 0 ? Math.ceil(summary.totalRecords / limit) : 0;

    res.json({
      state: normalizedState,
      records: mapData?.records || [],
      featuredRecord: mapData?.featuredRecord?.[0] || null,
      districtPreview: (mapData?.districtPreview || []).map(({ name }) => name),
      summary,
      pagination: {
        page,
        limit,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/states/:state", async (req, res) => {
  try {
    const normalizedState = normalizeParamValue(req.params.state);
    const data = await Pincode.aggregate([
      {
        $addFields: {
          normalizedState: buildNormalizedStateExpression(),
        },
      },
      {
        $match: {
          normalizedState,
        },
      },
      {
        $project: {
          normalizedState: 0,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/debug/count", async (_req, res) => {
  try {
    const count = await Pincode.countDocuments();
    const sample = await Pincode.findOne();

    res.json({
      totalRecords: count,
      sampleData: sample,
      message: `Total ${count} records in collection`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/debug/all", async (_req, res) => {
  try {
    const data = await Pincode.find().limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/districts", async (_req, res) => {
  try {
    const districts = await Pincode.aggregate([
      {
        $addFields: buildBaseRecordFields(),
      },
      {
        $match: {
          normalizedDistrict: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$normalizedDistrict",
          name: { $first: "$districtDisplay" },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $cond: [{ $ne: ["$name", ""] }, "$name", "$_id"],
          },
        },
      },
    ]);

    res.json(districts.map(({ name }) => name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/districts/:district", async (req, res) => {
  try {
    const normalizedDistrict = normalizeParamValue(req.params.district);
    const data = await Pincode.aggregate([
      {
        $addFields: {
          normalizedDistrict: buildNormalizedFieldExpression(DISTRICT_FIELDS),
        },
      },
      {
        $match: {
          normalizedDistrict,
        },
      },
      {
        $project: {
          normalizedDistrict: 0,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/states/:state/cities", async (req, res) => {
  try {
    const normalizedState = normalizeParamValue(req.params.state);
    const districts = await Pincode.aggregate([
      {
        $addFields: buildBaseRecordFields(),
      },
      {
        $match: {
          normalizedState,
          normalizedDistrict: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$normalizedDistrict",
          name: { $first: "$districtDisplay" },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $cond: [{ $ne: ["$name", ""] }, "$name", "$_id"],
          },
        },
      },
    ]);

    res.json(districts.map(({ name }) => name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

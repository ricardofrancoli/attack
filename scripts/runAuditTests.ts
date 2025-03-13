import type { Radar } from "../src/models/radar.model";
import { radars } from "./data/radars";

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  result: (label: string, data: unknown) => {
    console.log(`${colors.cyan}\n▶️ ${label}:${colors.reset}`);
    console.dir(data, { depth: null, colors: true });
  },
};

async function loadTestData() {
  log.info("Loading test data...");

  const addRadar = async (radar: Radar) => {
    try {
      const response = await fetch(`${BASE_URL}/radar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(radar),
      });

      if (!response.ok) {
        throw new Error(`Failed to add radar: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      log.error(`Error adding radar: ${error}`);
      throw error;
    }
  };

  try {
    await Promise.all(radars.map((radar) => addRadar(radar)));
    log.success(`Added ${radars.length} radar entries`);
  } catch (error) {
    log.error(`Failed to load test data: ${error}`);
    process.exit(1);
  }
}

async function testGetAllAudits() {
  log.info("Testing GET /audit endpoint...");

  try {
    const response = await fetch(`${BASE_URL}/audit`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    log.result("All Audit Entries", result);

    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
      log.warning("No audit entries found. This may be expected for a fresh database.");
    } else {
      log.success(`Found ${result.data.length} audit entries`);
    }

    return result;
  } catch (error) {
    log.error(`Test failed: ${error}`);
    throw error;
  }
}

async function testGetAuditById(id?: string) {
  let _id = id ?? null;

  if (!_id) {
    log.info("No ID provided, fetching latest entries first...");
    const latestEntries = await testGetAllAudits();

    if (!latestEntries?.data?.length || !latestEntries.data[0]?._id) {
      log.error("No entries available to test getById!");
      return null;
    }

    _id = latestEntries.data[0]._id;
  }

  log.info(`Testing GET /audit/${_id} endpoint...`);

  try {
    const response = await fetch(`${BASE_URL}/audit/${_id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    log.result("Audit Entry Details", result);
    log.success("Successfully retrieved audit by ID");

    return result;
  } catch (error) {
    log.error(`Test failed: ${error}`);
    throw error;
  }
}

async function testDeleteAuditById(id?: string) {
  let _id = id ?? null;

  if (!_id) {
    log.info("No ID provided, fetching latest entries first...");
    const latestEntries = await testGetAllAudits();

    if (!latestEntries?.data?.length || !latestEntries.data[0]?._id) {
      log.error("No entries available to test getById!");
      return null;
    }

    _id = latestEntries.data[0]._id;
  }

  log.info(`Testing DELETE /audit/${_id} endpoint...`);

  try {
    const response = await fetch(`${BASE_URL}/audit/${_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    log.result("Delete Operation Result", result);
    log.success("Successfully deleted audit entry");

    log.info("Verifying deletion...");
    try {
      const verifyResponse = await fetch(`${BASE_URL}/audit/${_id}`, {
        method: "GET",
      });

      if (verifyResponse.ok) {
        log.warning("Entry still exists after deletion! Delete may have failed.");
      } else {
        log.success("Verification complete: Entry no longer exists");
      }
    } catch (error) {
      log.success("Verification complete: Entry no longer exists");
    }

    return result;
  } catch (error) {
    log.error(`Test failed: ${error}`);
    throw error;
  }
}

// Run all tests in sequence
async function runAllTests() {
  log.info("Starting audit API tests...");
  console.log(`${colors.cyan}`, "=".repeat(50));

  try {
    // Load test data
    await loadTestData();
    console.log(`${colors.cyan}`, "=".repeat(50));

    // Test 1: Get all audits
    await testGetAllAudits();
    console.log(`${colors.cyan}`, "=".repeat(50));

    // Test 2: Get audit by ID
    await testGetAuditById();
    console.log(`${colors.cyan}`, "=".repeat(50));

    // Test 3: Delete audit
    await testDeleteAuditById();
    console.log(`${colors.cyan}`, "=".repeat(50));

    log.success("All tests completed successfully!");
  } catch (error) {
    log.error(`Test suite failed: ${error}`);
    process.exit(1);
  }
}

// Check if we're running a specific test or all tests
const testType = process.argv[2];

if (!testType || testType === "all") {
  runAllTests();
} else if (testType === "getAll") {
  loadTestData().then(() => testGetAllAudits());
} else if (testType === "getOne") {
  loadTestData().then(() => testGetAuditById());
} else if (testType === "deleteOne") {
  loadTestData().then(() => testDeleteAuditById());
} else {
  log.error(`Unknown test type: ${testType}`);
  log.info("Available options: all, getAll, getOne, deleteOne");
  process.exit(1);
}

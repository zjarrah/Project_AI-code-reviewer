const ALLOWED_SEVERITIES = ["info", "minor", "major", "critical", "blocker"];
const SCHEMAS = {
  minimal: {
    required: ["severity", "file", "issue", "suggestion"],
    optional: [],
  },
  extended: {
    required: ["severity", "file", "issue", "suggestion"],
    optional: ["line", "rule_id", "category"],
  },
};

function buildItemValidator(schemaName) {
  const shape = SCHEMAS[schemaName] ?? SCHEMAS.minimal;
  return function validateItem(item) {
    const errors = [];
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      errors.push("Item must be an object.");
      return { ok: false, errors };
    }
    // required
    for (const field of shape.required) {
      if (!(field in item)) errors.push(`Missing required field: ${field}`);
    }
    if (typeof item.severity !== "string")
      errors.push("severity must be a string");
    if (typeof item.file !== "string") errors.push("file must be a string");
    if (typeof item.issue !== "string") errors.push("issue must be a string");
    if (typeof item.suggestion !== "string")
      errors.push("suggestion must be a string");

    // allowed severities
    if (
      typeof item.severity === "string" &&
      !ALLOWED_SEVERITIES.includes(item.severity.toLowerCase())
    ) {
      errors.push(`severity must be one of ${ALLOWED_SEVERITIES.join(", ")}`);
    }

    // optionals for extended
    if ("line" in item && typeof item.line !== "number")
      errors.push("line must be a number");
    if ("rule_id" in item && typeof item.rule_id !== "string")
      errors.push("rule_id must be a string");
    if ("category" in item && typeof item.category !== "string")
      errors.push("category must be a string");

    // optional: flag overly generic issues
    const generic = [
      "improve performance",
      "refactor this",
      "use best practices",
    ];
    const blob = String(item.issue || "") + " " + String(item.suggestion || "");
    if (generic.some((g) => blob.toLowerCase().includes(g))) {
      // not a failure, but surfaced for logging in details
      errors.push("note: generic/overly broad phrasing detected");
    }

    return {
      ok: errors.filter((e) => !e.startsWith("note:")).length === 0,
      errors,
    };
  };
}

function validateArrayShape(arr, schemaName) {
  const errors = [];
  if (!Array.isArray(arr))
    return { ok: false, errors: ["Response must be a JSON array."] };
  const validateItem = buildItemValidator(schemaName);
  arr.forEach((item, idx) => {
    const { ok, errors: e } = validateItem(item);
    if (!ok) errors.push(`Item[${idx}] invalid: ${e.join("; ")}`);
  });
  return { ok: errors.length === 0, errors };
}

function guardrailValidate(json, schemaName, strict) {
  const { ok, errors } = validateArrayShape(json, schemaName);
  return { ok: strict ? ok : true, errors };
}

/* ========= Minimal “test runner” ========= */
const samplePython = `# A tiny Python script with no input validation
import sys

def greet():
    # No validation of sys.argv length
    name = sys.argv[1]   # could crash if missing
    print(f"Hello {name}!")

if __name__ == "__main__":
    greet()
`;

document.getElementById("sampleCode").textContent = samplePython;

function addRow(name, passed, details = "") {
  const tbody = document.querySelector("#results tbody");
  const row = document.createElement("tr");
  const idx = tbody.children.length + 1;

  const tdIdx = document.createElement("td");
  const tdName = document.createElement("td");
  const tdStatus = document.createElement("td");
  const tdDetails = document.createElement("td");

  tdIdx.textContent = idx;
  tdName.textContent = name;
  tdStatus.textContent = passed ? "PASS" : "FAIL";
  tdStatus.className = passed ? "pass" : "fail";
  tdDetails.textContent = details;

  row.append(tdIdx, tdName, tdStatus, tdDetails);
  tbody.appendChild(row);
}

function buildMockReviews({
  filename = "sample_python_no_validation.py",
  schema = "minimal",
} = {}) {
  // const base = [
  //   {
  //     severity: "major",
  //     file: filename,
  //     issue: "No input validation on argv",
  //     suggestion:
  //       "Validate `sys.argv` length and handle missing/extra arguments.",
  //   },
  //   {
  //     severity: "minor",
  //     file: filename,
  //     issue: "Missing error handling",
  //     suggestion:
  //       "Wrap argument access and printing in a try/except and print a helpful message.",
  //   },
  //   {
  //     severity: "info",
  //     file: filename,
  //     issue: "No usage/help text",
  //     suggestion: "Add a docstring or `--help` usage message for the CLI.",
  //   },
  // ];
   const base = 
    {
      severity: "major",
      file: filename,
      issue: "No input validation on argv",
      suggestion:
        "Validate `sys.argv` length and handle missing/extra arguments.",
    }

  if (schema === "extended") {
    // enrich items with optional fields required by the extended schema
    base[0].line = 6;
    base[0].rule_id = "PY-ARG-001";
    base[0].category = "Validation";

    base[1].line = 5;
    base[1].rule_id = "PY-ERR-002";
    base[1].category = "Error Handling";

    base[2].line = 1;
    base[2].rule_id = "DOC-001";
    base[2].category = "Documentation";
  }
  return base;
}

async function runTests() {
  // reset table
  document.querySelector("#results tbody").innerHTML = "";

  const apiUrl = document.getElementById("apiUrl").value.trim();
  const schema = document.getElementById("schema").value;
  const strict = document.getElementById("strict").value === "true";

  // Shared request payload
  const payload = {
    code: samplePython,
    filename: "sample_python_no_validation.py",
    language: "python",
  };

  let respData = null;
  // Test 1: HTTP & JSON array
  try {
    const res = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Review-Schema": schema,
      },
    });
    const statusOk = res.status >= 200 && res.status < 300;
    addRow("HTTP status 2xx", statusOk, `status=${res.status}`);
    respData = res.data;
    const isArray = Array.isArray(respData);
    addRow(
      "Response is JSON array",
      isArray,
      isArray ? "" : `typeof=${typeof respData}`
    );
  } catch (err) {
    // FALLBACK TO MOCK DATA
    addRow("HTTP/JSON request failed", false, String(err));
    addRow(
      "Using MOCK data",
      true,
      "No API available; generated local mock review items."
    );
    respData = buildMockReviews({ filename: payload.filename, schema });
    const isArray = Array.isArray(respData);
    addRow(
      "Response is JSON array (mock)",
      isArray,
      isArray ? "" : `The type is ${typeof respData} , it should be an array`
    );
  }

  // Test 2: Required fields & severity set
  const { ok: schemaOk, errors: schemaErrors } = guardrailValidate(
    respData,
    schema,
    strict
  );
  addRow(
    "Schema validation (" + schema + ")",
    schemaOk,
    schemaErrors.join(" | ")
  );

  // Test 3: Every item has required fields (explicit)
  if (Array.isArray(respData)) {
    let missing = [];
    for (let i = 0; i < respData.length; i++) {
      const it = respData[i];
      for (const f of ["severity", "file", "issue", "suggestion"]) {
        if (!(f in it)) missing.push(`Item[${i}] missing ${f}`);
        else if (typeof it[f] !== "string")
          missing.push(`Item[${i}] ${f} must be string`);
      }
    }
    addRow(
      "Required fields present (explicit check)",
      missing.length === 0,
      missing.join(" | ")
    );
  }

  // Test 4 (optional): mentions “validation”
  if (Array.isArray(respData)) {
    const mentions = respData.some(
      (it) =>
        typeof it.issue === "string" &&
        /validat/i.test((it.issue || "") + " " + (it.suggestion || ""))
    );
    addRow(
      'One issue mentions "validation"',
      mentions,
      mentions ? "" : "No validation hint detected"
    );
  }

  // Test 5: Severities normalized/allowed
  if (Array.isArray(respData)) {
    const unknown = [];
    for (let i = 0; i < respData.length; i++) {
      const s = String(respData[i].severity || "").toLowerCase();
      if (!ALLOWED_SEVERITIES.includes(s))
        unknown.push(`Item[${i}] severity=${respData[i].severity}`);
    }
    addRow(
      "Severities allowed/normalized",
      unknown.length === 0,
      unknown.join(" | ")
    );
  }

  // Test 6: Empty array is valid (smoke)
  // (We can't force the API to return empty here; this just displays the contract.)
  addRow(
    "Empty array is acceptable JSON",
    true,
    "Contract allows [] when no issues are found."
  );
}

/* ========= Human vs AI demo comparison ========= */
function demoCompare() {
  const ai = [
    {
      severity: "major",
      file: "sample_python_no_validation.py",
      issue: "No input validation on argv",
      suggestion: "Check argv length and handle missing args.",
    },
  ];
  const human = [
    {
      severity: "major",
      file: "sample_python_no_validation.py",
      issue: "Potential IndexError (argv)",
      suggestion: "Guard sys.argv access with length check.",
    },
    {
      severity: "minor",
      file: "sample_python_no_validation.py",
      issue: "Missing usage/docs",
      suggestion: "Add a docstring or usage help.",
    },
  ];
  const key = (x) => `${x.file}|${x.issue}`.toLowerCase();
  const aiSet = new Set(ai.map(key));
  const humanSet = new Set(human.map(key));
  const onlyAI = ai.filter((x) => !humanSet.has(key(x)));
  const onlyHuman = human.filter((x) => !aiSet.has(key(x)));
  const overlap = ai.filter((x) => humanSet.has(key(x)));

  const out = [
    "=== Overlap ===",
    JSON.stringify(overlap, null, 2),
    "",
    "=== Only in AI ===",
    JSON.stringify(onlyAI, null, 2),
    "",
    "=== Only in Human ===",
    JSON.stringify(onlyHuman, null, 2),
  ].join("\n");
  const pre = document.getElementById("compareOut");
  pre.textContent = out;
  pre.style.display = "block";
}

/* ========= Wire up UI ========= */
document.getElementById("runBtn").addEventListener("click", runTests);
document.getElementById("compareBtn").addEventListener("click", demoCompare);

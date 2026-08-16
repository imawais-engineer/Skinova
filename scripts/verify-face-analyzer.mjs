function asRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function readStringField(record, keys) {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function normalizeFaceAnalyzerResult(payload) {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const results = asRecord(data?.results) || asRecord(root?.results) || data;

  if (!results) {
    return null;
  }

  const faceShape = readStringField(results, ["faceShape", "faceshape", "face_shape"]);
  const eyeShape =
    readStringField(asRecord(results.eyelid), ["left_shape", "right_shape", "leftShape", "rightShape"]) ||
    readStringField(results, ["eyeShape", "eyeshape", "eye_shape"]);
  const noseWidth =
    readStringField(asRecord(results.nose), ["width", "noseWidth", "nose_width"]) ||
    readStringField(results, ["noseWidth", "nosewidth", "nose_width"]);
  const lipShapeCandidate = Array.isArray(results.lipshape) ? results.lipshape[0] : results.lipshape;
  const lipShape =
    typeof lipShapeCandidate === "string" && lipShapeCandidate.trim()
      ? lipShapeCandidate.trim()
      : readStringField(results, ["lipShape", "lipshape", "lip_shape"]);
  const ageGender = asRecord(results.agegender) || asRecord(results.ageGender) || asRecord(results.age_gender);
  const estimatedAge =
    typeof ageGender?.age === "number"
      ? Math.round(ageGender.age)
      : typeof results.age === "number"
        ? Math.round(results.age)
        : undefined;

  if (!faceShape && !eyeShape && !noseWidth && !lipShape && estimatedAge === undefined) {
    return null;
  }

  return { faceShape, estimatedAge, eyeShape, noseWidth, lipShape, source: "live" };
}

const mockPayload = {
  data: {
    task_status: "success",
    results: {
      faceshape: "Oval",
      agegender: { age: 28, gender: "female" },
      eyelid: { left_shape: "Almond", right_shape: "Almond" },
      nose: { width: "Medium" },
      lipshape: ["Full"]
    }
  }
};

const normalized = normalizeFaceAnalyzerResult(mockPayload);
const ok =
  normalized?.faceShape === "Oval" &&
  normalized?.estimatedAge === 28 &&
  normalized?.eyeShape === "Almond" &&
  normalized?.lipShape === "Full";

console.log(
  JSON.stringify(
    {
      ok,
      faceShape: normalized?.faceShape || null,
      estimatedAge: normalized?.estimatedAge ?? null,
      eyeShape: normalized?.eyeShape || null
    },
    null,
    2
  )
);

process.exit(ok ? 0 : 1);

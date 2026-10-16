
function parseGhs(amount) {
  if (typeof amount !== "string") {
    throw new Error("Amount must be a string");
  }

  const value = amount.trim();

  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
    throw new Error("Invalid GHS amount");
  }

  const [cedis, decimals = ""] = value.split(".");
  const pesewas =
    Number(cedis) * 100 +
    Number(decimals.padEnd(2, "0"));

  if (!Number.isSafeInteger(pesewas)) {
    throw new Error("Amount is too large");
  }

  return pesewas;
}

function formatGhs(pesewas) {
  return `${Math.floor(pesewas / 100)}.${String(
    pesewas % 100
  ).padStart(2, "0")}`;
}

module.exports = { parseGhs, formatGhs };

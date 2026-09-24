export default function formatCount(value) {
  if (typeof value !== "number") return value;

  if (value >= 1_000_000_000) {
    return (
      (value / 1_000_000_000)
        .toFixed(value % 1_000_000_000 === 0 ? 0 : 1)
        .replace(".0", "") + "B"
    );
  }

  if (value >= 1_000_000) {
    return (
      (value / 1_000_000)
        .toFixed(value % 1_000_000 === 0 ? 0 : 1)
        .replace(".0", "") + "M"
    );
  }

  if (value >= 1_000) {
    return (
      (value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1).replace(".0", "") +
      "K"
    );
  }

  return value.toLocaleString();
}

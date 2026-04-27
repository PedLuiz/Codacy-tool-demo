/*
  INTENTIONAL_ISSUE:
  - duplicated functions
  - poor variable naming
  - nested conditions / high complexity
  - use of == instead of ===
  - unused variables
*/

function formatReportLineOne(item) {
  let text = "unknown - 0";
  if (item && item.name) {
    text = `${item.name} - ${item.score}`;
  }
  return text.trim();
}

// INTENTIONAL_ISSUE: duplicated logic for Codacy duplication detection
function formatReportLineTwo(item) {
  let text = "unknown - 0";
  if (item && item.name) {
    text = `${item.name} - ${item.score}`;
  }
  return text.trim();
}

function calculateRiskLevel(score, mode) {
  const temp = "unused"; // INTENTIONAL_ISSUE: no-unused-vars
  let x = "LOW";

  if (score != null) {
    if (score > 70) {
      if (mode == "double") {
        if (score > 90) {
          x = "CRITICAL";
        } else {
          x = "HIGH";
        }
      } else {
        x = "HIGH";
      }
    } else if (score > 30) {
      if (mode == "legacy") {
        x = "MEDIUM_LEGACY";
      } else {
        x = "MEDIUM";
      }
    } else {
      x = "LOW";
    }
  }

  return x;
}

module.exports = {
  formatReportLineOne,
  formatReportLineTwo,
  calculateRiskLevel,
};

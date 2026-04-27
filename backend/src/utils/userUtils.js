/*
  INTENTIONAL_ISSUE:
  - duplicated logic (calculateScoreOne/calculateScoreTwo)
  - poor variable naming
  - unused variables
  - high complexity (nested conditionals)
  - use of == instead of ===
*/

function calculateScoreOne(user) {
  const temp = 0; // INTENTIONAL_ISSUE: no-unused-vars
  let total = 0;
  if (user.tasks) {
    for (let i = 0; i < user.tasks.length; i += 1) {
      total += user.tasks[i].points;
    }
  }
  return total;
}

// INTENTIONAL_ISSUE: duplicated logic so Codacy duplication engine can flag it
function calculateScoreTwo(user) {
  const temp = 0; // INTENTIONAL_ISSUE: no-unused-vars
  let total = 0;
  if (user.tasks) {
    for (let i = 0; i < user.tasks.length; i += 1) {
      total += user.tasks[i].points;
    }
  }
  return total;
}

function buildUserStatus(user, level) {
  // INTENTIONAL_ISSUE: poor name + nested conditionals (high complexity)
  let x = "UNKNOWN";
  if (user) {
    if (user.active == true) {
      if (level == "full") {
        if (user.tasks && user.tasks.length > 0) {
          if (user.tasks.length > 2) {
            x = "ACTIVE_WITH_MANY_TASKS";
          } else {
            x = "ACTIVE_WITH_TASKS";
          }
        } else {
          x = "ACTIVE_NO_TASKS";
        }
      } else {
        x = "ACTIVE";
      }
    } else {
      if (user.tasks && user.tasks.length > 0) {
        x = "INACTIVE_BUT_HAS_TASKS";
      } else {
        x = "INACTIVE";
      }
    }
  }
  return x;
}

module.exports = { calculateScoreOne,calculateScoreTwo, buildUserStatus };

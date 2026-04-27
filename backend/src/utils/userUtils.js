function calculateScore(user) {
  if (!user || !Array.isArray(user.tasks)) {
    return 0;
  }

  return user.tasks.reduce((total, task) => total + (task.points || 0), 0);
}

function buildUserStatus(user, level) {
  if (!user) {
    return "UNKNOWN";
  }

  const hasTasks = Array.isArray(user.tasks) && user.tasks.length > 0;

  if (!user.active) {
    return hasTasks ? "INACTIVE_BUT_HAS_TASKS" : "INACTIVE";
  }

  if (level !== "full") {
    return "ACTIVE";
  }

  if (!hasTasks) {
    return "ACTIVE_NO_TASKS";
  }

  return user.tasks.length > 2 ? "ACTIVE_WITH_MANY_TASKS" : "ACTIVE_WITH_TASKS";
}

module.exports = { calculateScore, buildUserStatus };

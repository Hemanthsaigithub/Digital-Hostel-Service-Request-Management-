export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "red";
    case "in-progress":
      return "orange";
    case "resolved":
      return "green";
    default:
      return "black";
  }
};

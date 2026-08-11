import React from "react";

const PageNotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorText}>404 Error</h1>
      <h2 style={styles.subText}>Page Not Found</h2>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
  },
  errorText: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: "1.5rem",
    color: "#666",
  },
};

export default PageNotFound;

module.exports = {
  apps: [
    {
      name: "property-frontend",
      cwd: __dirname + "/..",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};

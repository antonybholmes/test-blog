const cssnano = require("cssnano");

module.exports = {
  plugins: [
    process.env.NODE_ENV === "production" ? require("autoprefixer") : null,
    process.env.NODE_ENV === "production"
      ? cssnano({
          preset: ["default", { discardComments: { removeAll: true } }],
        })
      : null,
  ],
};

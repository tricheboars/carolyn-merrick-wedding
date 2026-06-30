module.exports = function (eleventyConfig) {
  // Copy static assets (css, svg, img, favicon, js) straight through to /assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Rebuild when CSS / SVG change
  eleventyConfig.addWatchTarget("src/assets/css");
  eleventyConfig.addWatchTarget("src/assets/svg");

  // Tiny helper: current year (footer)
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};

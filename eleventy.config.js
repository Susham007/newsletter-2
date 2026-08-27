const path = require("node:path");
const ImageModule = require("@11ty/eleventy-img");
const Image = ImageModule.default;

const escapeAttribute = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2":
      "assets/fonts/inter-latin-wght-normal.woff2"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2":
      "assets/fonts/source-serif-4-latin-wght-normal.woff2"
  });
  eleventyConfig.addWatchTarget("./src/assets/images/");

  eleventyConfig.addNunjucksAsyncShortcode(
    "emailImage",
    async (src, alt = "", width = 640, baseUrl = "") => {
      const inputPath = src.startsWith("/") ? `./src${src}` : src;
      const metadata = await Image(inputPath, {
        widths: [Number(width)],
        formats: ["jpeg"],
        outputDir: "./_site/assets/images/generated/",
        urlPath: "/assets/images/generated/",
        sharpJpegOptions: { quality: 80, progressive: true },
        filenameFormat: (id, source, outputWidth, format) => {
          const name = path.basename(source, path.extname(source));
          return `${name}-${outputWidth}w.${format}`;
        }
      });
      const image = metadata.jpeg[0];

      return `<img src="${escapeAttribute(baseUrl)}${image.url}" width="${image.width}" height="${image.height}" alt="${escapeAttribute(alt)}" style="display:block;width:100%;max-width:${image.width}px;height:auto;border:0;outline:none;text-decoration:none;">`;
    }
  );

  eleventyConfig.addGlobalData(
    "absoluteUrl",
    process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:8080"
  );

  const publishedByFormat = (collectionApi, format) => {
    return collectionApi
      .getFilteredByGlob("./src/articles/*.md")
      .filter((item) => item.data.status === "published" && item.data.format === format)
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
  };

  eleventyConfig.addCollection("leads", (collectionApi) => publishedByFormat(collectionApi, "lead"));
  eleventyConfig.addCollection("dataBriefs", (collectionApi) => publishedByFormat(collectionApi, "data"));
  eleventyConfig.addCollection("storyList", (collectionApi) => publishedByFormat(collectionApi, "story"));

  eleventyConfig.addFilter("head", (items) => items?.[0]);
  eleventyConfig.addFilter("tail", (items) => items?.slice(1) ?? []);
  eleventyConfig.addFilter("displayDate", (value) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    }).format(new Date(value));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};

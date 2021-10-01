const dayjs = require("dayjs")
const Image = require("@11ty/eleventy-img");
const htmlmin = require("html-minifier")

const now = String(Date.now())

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    outputDir: "_site/img/",
    widths: [300, 640, 768, 1024, 1280, 1536],
    formats: ["webp", "jpeg"]
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = (eleventyConfig) => {
  //eleventyConfig.addPassthroughCopy("src/img")

  // eleventyConfig.setBrowserSyncConfig({
	// 	files: './_site/css/**/*.css'
	// })

  eleventyConfig.addPassthroughCopy({
    './node_modules/alpinejs/dist/cdn.js': './js/alpine.js',
  })

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode)
  //eleventyConfig.addLiquidShortcode("image", imageShortcode)
  //eleventyConfig.addJavaScriptFunction("image", imageShortcode)

  eleventyConfig.addShortcode("excerpt", (article) => extractExcerpt(article))

  eleventyConfig.addFilter("dateIso", (date) => {
    return dayjs(date).toISOString()
  })

  eleventyConfig.addFilter("dateReadable", (date) => {
    return dayjs(date).format("MMM DD, YYYY") // E.g. May 31, 2019
  })

  eleventyConfig.addWatchTarget("./tailwind.config.js")
  eleventyConfig.addWatchTarget("./src/css/tailwind.css")

  eleventyConfig.addShortcode("version", function () {
    return now
  })

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }

    return content
  })

  return {
    dir: {
      input: "src",
    },
  }
}

function extractExcerpt(article) {
  if (!article.hasOwnProperty("templateContent")) {
    console.warn(
      'Failed to extract excerpt: Document has no property "templateContent".'
    )
    return null
  }

  let excerpt = null
  const content = article.templateContent

  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: "<!-- excerpt start -->", end: "<!-- excerpt end -->" },
    { start: "<p>", end: "</p>" },
  ]

  separatorsList.some((separators) => {
    const startPosition = content.indexOf(separators.start)
    const endPosition = content.indexOf(separators.end)

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content
        .substring(startPosition + separators.start.length, endPosition)
        .trim()
      return true // Exit out of array loop on first match
    }
  })

  return excerpt
}

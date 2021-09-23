const dayjs = require("dayjs")

const htmlmin = require("html-minifier")

const now = String(Date.now())

module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode("excerpt", (article) => extractExcerpt(article))

  eleventyConfig.addFilter("dateIso", (date) => {
    return dayjs(date).toISOString()
  })

  eleventyConfig.addFilter("dateReadable", (date) => {
    return dayjs(date).format("MMM DD, YYYY") // E.g. May 31, 2019
  })

  eleventyConfig.addWatchTarget("./styles/tailwind.config.js")
  eleventyConfig.addWatchTarget("./styles/tailwind.css")

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

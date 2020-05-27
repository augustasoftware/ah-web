/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")

// Fix for third-party modules
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /clipboard/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // Create Post Pages
  const newsroomPages = await graphql(`
    {
      prismic {
        allNewsroom_posts(sortBy: meta_firstPublicationDate_DESC) {
          edges {
            node {
              _meta {
                uid
              }
            }
          }
        }
      }
    }
  `)

  const newsroomTemplate = path.resolve("src/templates/newsroom.js")
  const posts = newsroomPages.data.prismic.allNewsroom_posts.edges
  posts.forEach((edge, index) => {
    createPage({
      path: `/newsroom/${edge.node._meta.uid}`,
      component: newsroomTemplate,
      context: {
        uid: edge.node._meta.uid,
        prev: index === 0 ? null : posts[index - 1],
        next: index === (posts.length - 1) ? null : posts[index + 1],
      },
    })
  })

  // Create Author Pages
  const authorPages = await graphql(`
    {
      prismic {
        allAuthors {
          edges {
            node {
              _meta {
                uid
                id
              }
            }
          }
        }
      }
    }
  `)

  const authorTemplate = path.resolve("src/templates/author.js")
  const authors = authorPages.data.prismic.allAuthors.edges
  authors.forEach((edge) => {
    createPage({
      path: `/author/${edge.node._meta.uid}`,
      component: authorTemplate,
      context: {
        uid: edge.node._meta.uid,
        id: edge.node._meta.id,
      },
    })
  })
}
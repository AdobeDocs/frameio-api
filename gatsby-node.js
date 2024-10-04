exports.createPages = async ({ graphql, actions }) => {
  const { createRedirect } = actions

  createRedirect({
    fromPath: `/frameio/api`,
    toPath: `/frameio/api/current`,
  })
}

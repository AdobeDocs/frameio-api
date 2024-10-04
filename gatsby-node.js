exports.createPages = async ({ graphql, actions }) => {
  const { createRedirect } = actions

  createRedirect({
    fromPath: `/api`,
    toPath: `/api/current`,
  })
}

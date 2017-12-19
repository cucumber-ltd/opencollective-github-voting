const simpleOauthModule = require('simple-oauth2')
const asyncRouter = require('../infrastructure/express-extensions/asyncRouter')
const GitHub = require('github')

module.exports = ({ gitHubOauthId, gitHubOauthSecret }) => {
  const router = asyncRouter()

  if (!gitHubOauthSecret) return router

  const oauth2 = simpleOauthModule.create({
    client: {
      id: gitHubOauthId,
      secret: gitHubOauthSecret,
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  })

  const callbackPath = '/auth/github/callback'

  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `http://localhost:8080${callbackPath}`,
    scope: 'user:email',
  })

  router.get('/auth/github', (req, res) => {
    console.log(authorizationUri)
    res.redirect(authorizationUri)
  })

  router.$get(callbackPath, async (req, res) => {
    const code = req.query.code
    const result = await oauth2.authorizationCode.getToken({ code })
    const token = oauth2.accessToken.create(result).token.access_token
    const github = new GitHub()
    github.authenticate({ type: 'oauth', token })
    const userRes = await github.users.get({})
    const user = userRes.data
    console.log('USER', user)

    // TODO: Dispatch command: GitHubUserAuthenticated {user.login, token}
    //
    // For first-timers:
    // * create account holder
    //   * create commit-days, closed-issues and votes accounts
    //   * start a background job (saga) to update commit-days and closed-issues
    //     - We need a saga that updates this regularly
    // * Link User to AccountHolder
    //
    // For returning users
    // * Nothing?
    //
    // When they authenticate with OpenCollective:
    // * Find a matching account holder for GitHub:
    //   - either by looking at the current http session
    //   - or by matching on email (unreliable, maybe skip this)

    res.redirect('/')
  })

  return router
}

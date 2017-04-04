const Application = require('baseweb/app');
const GenericRoutes = require('../routes/generic');

// Factory for the main web application.
//
// Any dependencies that are needed by routes, such as client
// libraries, should be injected as parameters to this function.
//
// Delete or replace this comment.
module.exports = function (applicationOptions) {
  const app = new Application(applicationOptions);

  // Install routes.

  app.use(GenericRoutes().routes());

  // Perform any other application-specific setup here.

  return app;
};

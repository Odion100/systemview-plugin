const SystemViewModule = require("./SystemViewModule");
const { getSpecList } = require("./utils");

module.exports = function ({
  connection = "http://localhost:3300/systemview/api",
  specs = "./specs",
  projectCode,
  serviceId,
  helperMethods,
}) {
  return function (App) {
    App.loadService("SystemView", connection)
      .module(
        "Plugin",
        SystemViewModule({
          specs,
          App,
          projectCode,
          serviceId,
          helperMethods,
        })
      )
      .on(
        "ready",
        async function connectSystemView({ connectionData, modules, routing, services }) {
          const system = { connectionData, modules, routing, services };
          try {
            const { SystemView } = this.useService("SystemView");
            const specList = getSpecList(specs);
            await SystemView.connect({ system, projectCode, serviceId, specList });
            console.log(`[SystemView]: ${projectCode}.${serviceId} connected!\n`);
          } catch (error) {
            console.log(`[SystemView]: ${projectCode}.${serviceId} connection failed\n`);
          }
        }
      );
  };
};

/**
 * @name Notium
 * @version 0.1.0
*/

const request = require("request");
const fs = require("fs");
const path = require("path");

const config = {
    info: {
    name: "Notium",
    authors: [
        {
            name: "Jvuns"
        }
    ],
    version: "0.1.0",
    description: "Listens for notifications",
	},
  changelog: [],
  defaultConfig: []
};

module.exports = !global.ZeresPluginLibrary
  ? class {
      constructor() {
        this._config = config;
      }

      load() {
        BdApi.showConfirmationModal(
          "Library plugin is needed",
          `The library plugin needed is missing. Please click Download Now to install it.`,
          {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
              request.get(
                "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                (error, response, body) => {
                  if (error)
                    return electron.shell.openExternal(
                      "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                    );

                  fs.writeFileSync(
                    path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
                    body
                  );
                }
              );
            },
          }
        );
      }

      start() {}

      stop() {}
    }
  : (([Plugin, Library]) => {
    const { Patcher, DiscordModules, Logger } = Library;
    const { Dispatcher } = DiscordModules;

    class NotiumPlugin extends Plugin {
        constructor() {
          super();

          const om = this.onMessage.bind(this);
          this.onMessage = (e) => {
            try { om(e); } 
            catch (e) {
              console.log(
                `%c[Notium]%c Error!%c`,
                "color: #3a71c1;",
                "font-weight: 700; color: #b3001b;",
                "\n",
                e
              );
              BdApi.alert(
                "Notium plugin",
                "There was an error while trying to start the plugin."
              );
            }
          };
        }

        onStart() {
            Dispatcher.subscribe("MESSAGE_CREATE", this.onMessage);
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: " + a[0];
            });
        }

        onMessage({ message }) {
          
        }   
        
        onStop() {
            Dispatcher.unsubscribe("MESSAGE_CREATE", this.onMessage);
            Patcher.unpatchAll();
        }
      };
      
    return NotiumPlugin;
})(global.ZeresPluginLibrary.buildPlugin(config));
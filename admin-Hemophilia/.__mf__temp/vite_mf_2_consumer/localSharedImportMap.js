
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "vue": async () => {
          let pkg = await import("__mf__virtual/vite_mf_2_consumer__prebuild__vue__prebuild__.js")
          return pkg
        }
      ,
        "pinia": async () => {
          let pkg = await import("__mf__virtual/vite_mf_2_consumer__prebuild__pinia__prebuild__.js")
          return pkg
        }
      ,
        "element-plus": async () => {
          let pkg = await import("__mf__virtual/vite_mf_2_consumer__prebuild__element_mf_2_plus__prebuild__.js")
          return pkg
        }
      ,
        "vue-router": async () => {
          let pkg = await import("__mf__virtual/vite_mf_2_consumer__prebuild__vue_mf_2_router__prebuild__.js")
          return pkg
        }
      ,
        "axios": async () => {
          let pkg = await import("__mf__virtual/vite_mf_2_consumer__prebuild__axios__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "vue": {
            name: "vue",
            version: "3.5.13",
            scope: ["default"],
            loaded: false,
            from: "vite-consumer",
            async get () {
              usedShared["vue"].loaded = true
              const {"vue": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^3.5.13"
            }
          }
        ,
          "pinia": {
            name: "pinia",
            version: "2.3.0",
            scope: ["default"],
            loaded: false,
            from: "vite-consumer",
            async get () {
              usedShared["pinia"].loaded = true
              const {"pinia": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.3.0"
            }
          }
        ,
          "element-plus": {
            name: "element-plus",
            version: "2.9.1",
            scope: ["default"],
            loaded: false,
            from: "vite-consumer",
            async get () {
              usedShared["element-plus"].loaded = true
              const {"element-plus": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.9.1"
            }
          }
        ,
          "vue-router": {
            name: "vue-router",
            version: "4.5.0",
            scope: ["default"],
            loaded: false,
            from: "vite-consumer",
            async get () {
              usedShared["vue-router"].loaded = true
              const {"vue-router": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^4.5.0"
            }
          }
        ,
          "axios": {
            name: "axios",
            version: "1.7.9",
            scope: ["default"],
            loaded: false,
            from: "vite-consumer",
            async get () {
              usedShared["axios"].loaded = true
              const {"axios": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.7.9"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      
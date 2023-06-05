require([
    "esri/WebScene", 
    "esri/views/SceneView", 
    "esri/layers/SceneLayer",
    "esri/layers/FeatureLayer", 
    "esri/layers/PointCloudLayer", 
    "esri/renderers/PointCloudRGBRenderer", 
    "esri/renderers/PointCloudStretchRenderer"      
  ], function (
    WebScene, 
    SceneView, 
    SceneLayer,
    FeatureLayer, 
    PointCloudLayer, 
    PointCloudRGBRenderer, 
    PointCloudStretchRenderer
    ) {

    let giraldaLayer;
    let sevillaBaseMap3D;
    let LASlayer;
    let pointLayer;

    const webscene = new WebScene({
      portalItem:  {
        id: "ba7f41cd241a428e9c45ebf0712d190a" 
      }
    });

    const view = new SceneView({
      map: webscene,
      container: "viewDiv",
      qualityProfile: "high",
      environment: {
        lighting: {
          directShadowsEnabled: true,
          ambientOcclusionEnabled: false,
          date: "Thu Mar 15 2023 14:55:00 GMT+0100 (Central European Standard Time)", //Cambiar por día de hoy
        },
        atmosphereEnabled: true,
        background: {
          type: "color",
          color: "white",
        },
        starsEnabled: false,
      },
      ui: {
        components: [],
      },
    });

    giraldaLayer = new SceneLayer({
      portalItem: {
        id: "1fec62a194bc4a958a9647eee05b3dcf" //Giralda
      }, 
      popupEnabled: false, 
      elevationInfo: {
        mode: "absolute-height", 
        offset: 10, 
      }, 
    }); 

    //El render de la capa de puntos lidar
    var rgbRenderer = new PointCloudRGBRenderer({
      field: "RGB",
       pointSizeAlgorithm: {
        type: "fixed-size",
        useRealWorldSymbolSizes: false,
        size: 2
      },

      pointsPerInch: 60
    });

    var stretchrenderer = new PointCloudStretchRenderer({
      field: "ELEVATION",

      pointSizeAlgorithm: {
        type: "fixed-size",
        useRealWorldSymbolSizes: false,
        size: 2
      },
      pointsPerInch: 30,

      stops:  [{
        value: 58,
        color: [61, 51, 158]
      }, {
        value: 60,
        color: [73, 196, 196]
      }, {
        value: 65,
        color: [104, 196, 73]
      }, {
        value: 70,
        color: [235, 232, 84]
      }, {
        value: 75,
        color: [235, 162, 84]
      }, {
        value: 80,
        color: [235, 84, 84]
      }, {
        value: 85,
        color: [100, 100, 100]
      }]
    })

    LASlayer = new PointCloudLayer({
      portalItem: {
        id: "3b277cd76a31486a8fd347e35a640188" // Point Cloud de cartuja
      }, 
      popupEnabled: false, 
      elevationInfo: {
        mode: "absolute-height", 
        offset:-51 , 
      },  
      renderer: null
    })

    console.log(LASlayer)

    planDesarrollo = new FeatureLayer({
      url: "https://services1.arcgis.com/hcmP7kr0Cx3AcTJk/arcgis/rest/services/Info_Urban/FeatureServer/22?", 
    })

    elementosBIC = new FeatureLayer({
      url: "https://services1.arcgis.com/hcmP7kr0Cx3AcTJk/arcgis/rest/services/Info_Urban/FeatureServer/23?"
    })

    calificacionSueloFL = new FeatureLayer({
      url: "https://services1.arcgis.com/hcmP7kr0Cx3AcTJk/arcgis/rest/services/Info_Urban/FeatureServer/34?"
    })


    console.log(webscene)

    webscene.add(giraldaLayer)
    webscene.add(planDesarrollo)
    // webscene.add(elementosBIC)
    webscene.add(calificacionSueloFL)
    webscene.add(LASlayer)

    window.view = view

    webscene.when(function(){
      mapaBase3D = webscene.layers.filter(function(layer){
        return layer.title === "Mapa base 3D";
      }).getItemAt(0)

      sevillaBaseMap3D = mapaBase3D.layers.filter(function(layer){
        return layer.title === "Sevilla 3d LOD2 multiPatch";
      }).getItemAt(0); 

    }).then(function(){

      sevillaBaseMap3D.renderer = {
        type: "simple",
        symbol: {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: "#ffffff",
                colorMixMode: "replace",
              },
              edges: {
                type: "solid",
                color: [0, 0, 0, 0.7],
              },
            },
  
          ],
        },
      }
      const switch2 = document.getElementById('layerSwitch2')
      switch2.addEventListener('calciteDropdownItemSelect', function(event){
        if (event.target.selected) {
          mapaBase3D.visible = false//sevillaBaseMap3D.visible = true; //sevilla3D.visible = true;
        } else {
          mapaBase3D.visible = true//sevillaBaseMap3D.visible = false//sevilla3D.visible = false;
        }
      })

      const switch3 = document.getElementById('layerSwitch3')
      switch3.addEventListener('calciteDropdownItemSelect', function(event){
        if (event.target.selected) {
          giraldaLayer.visible = false;
        } else {
          giraldaLayer.visible = true;
          view.goTo({
            heading: 250,
            tilt: 78,
            position: [-5.989570007788597, 37.38659705975595, 95]
          })
          
        }
      })

      const switch7 = document.getElementById('layerSwitch7')
      switch7.addEventListener('calciteDropdownItemSelect', function(event){
        if (event.target.selected){
          LASlayer.visible = false; 
        } else {
          LASlayer.visible = true;
          view.goTo({
            heading: 250,
            tilt: 78,
            position: [-6.00285, 37.4079500000, 50]
          })
        }
      })

      const switch5 = document.getElementById('layerSwitch5')
      switch5.addEventListener('calciteDropdownItemSelect', function(event){
        if (event.target.selected) {
          LASlayer.renderer = stretchrenderer;
        } else {
          LASlayer.renderer = rgbRenderer;
        }
      })

      const switch6 = document.getElementById('layerSwitch6')
      switch6.addEventListener('calciteDropdownItemSelect', function(event){
        if (event.target.selected) {
          LASlayer.renderer = rgbRenderer; 
        }
        else {
          LASlayer.renderer = stretchrenderer;
        }
      })
      
    }).catch(function(error){
      console.error(error)
    })

    view.when().then(function() {
        // First, set the camera to the zenithal view
        return view.goTo({
            tilt: 0, // Zenithal view
            position: [-5.9934089570007788597, 37.38596, 500] // Higher altitude for zenithal view
        });
    }).then(function() {
        // Add a delay before executing the second goTo
        return new Promise(function(resolve) {
            setTimeout(resolve, 5000); // Delay of 2 seconds
        });
    }).then(function() {
        // After the delay, set the camera to the specific point
        return view.goTo({
            heading: 250,
            tilt: 78,
            position: [-5.989570007788597, 37.38659705975595, 95]
        });
    }).catch(function(error) {
        // If there's an error during the execution of the goTo commands, log it to the console
        console.error(error);
    });

    const radio_uno = document.getElementById('uno'); 
    const radio_dos = document.getElementById('dos'); 
    const radio_tres = document.getElementById('tres'); 
    const radio_cuatro = document.getElementById('cuatro');
    const radio_cinco = document.getElementById('cinco');

    const options = document.getElementsByClassName("radio-item");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener("click", function (element) {
        const style = element.target.dataset.style;
        switch (style) {
          case "realistic":
            radio_uno.style.boxShadow = "0 0 0 8px rgba(0, 0, 0, 0.4)";
            radio_dos.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_tres.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_cuatro.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_cinco.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            giraldaLayer.renderer = {
              type: "simple",
              symbol: {
                type: "mesh-3d",
                symbolLayers: [
                  {
                    type: "fill",
                    material: null,
                  },
                ],
              },
            };
            break;
          case "gray":
            radio_uno.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_dos.style.boxShadow = "0 0 0 8px rgba(0, 0, 0, 0.4)";
            radio_tres.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_cuatro.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_cinco.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            giraldaLayer.renderer = {
              type: "simple",
              symbol: {
                type: "mesh-3d",
                symbolLayers: [
                  {
                    type: "fill",
                    material: {
                      color: "#ffffff",
                      colorMixMode: "tint",
                    },
                    edges: {
                      type: "solid",
                      color: [0, 0, 0, 0.7],
                    },
                  },
                ],
              },
            };
            break;
          case "abstract":
            radio_uno.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_dos.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_tres.style.boxShadow = "0 0 0 8px rgba(0, 0, 0, 0.4)";
            radio_cuatro.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_cinco.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            giraldaLayer.renderer = {
              type: "simple",
              symbol: {
                type: "mesh-3d",
                symbolLayers: [
                  {
                    type: "fill",
                    material: {
                      color: "#ffffff",
                      colorMixMode: "replace",
                    },
                    edges: {
                      type: "solid",
                      color: [0, 0, 0, 0.7],
                    },
                  },
                ],
              },
            };
            break;
          case "sketch":
            radio_uno.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_dos.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_tres.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            radio_cuatro.style.boxShadow = "0 0 0 8px rgba(0, 0, 0, 0.4)";
            radio_cinco.style.boxShadow = "0 0 0 4px rgba(0, 0, 0, 0.4)";
            giraldaLayer.renderer = {
              type: "simple",
              symbol: {
                type: "mesh-3d",
                symbolLayers: [
                  {
                    type: "fill",
                    material: {
                      color: "#efe8da",
                      colorMixMode: "replace",
                    },
                    edges: {
                      type: "sketch",
                      color: [0, 0, 0, 0.7],
                    },
                  },
                ],
              },
            };
            break;
        }
      });
    }

  });


const switch1 = document.getElementById('layerSwitch1')
switch1.addEventListener('calciteDropdownItemSelect', function(event){
  if (event.target.selected) {
    planDesarrollo.visible = false;
  } else {
    planDesarrollo.visible = true;
    view.goTo({
      tilt: 0, // Zenithal view
      position: [-5.9934089570007788597, 37.38596, 25000] // Higher altitude for zenithal view
    })
  }
})

const switch4 = document.getElementById('layerSwitch4')
switch4.addEventListener('calciteDropdownItemSelect', function(event){
  if (event.target.selected) {
    calificacionSueloFL.visible = false;
  } else {
    calificacionSueloFL.visible = true;
    view.goTo({
      tilt: 0, // Zenithal view
      position: [-5.9934089570007788597, 37.38596, 25000] // Higher altitude for zenithal view
    })
  }
})
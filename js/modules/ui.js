var inited = false;
var PIXI = require('../lib/pixi.dev.js');
var UI = {
    layers: [],
    layerContainer: new PIXI.DisplayObjectContainer(),
    addLayer: function (name, index, layer) {
        if (!inited) {
            window.stage.addChild(UI.layerContainer);
            inited = true;
        }
        if (this.getLayer(name)) {
            throw "Layer with name " + name + " already exists";
        }
        layer = layer || new PIXI.DisplayObjectContainer();
        var layerObj = {name: name, layer: layer};
        if (index === undefined) {
            this.layers.push(layerObj);
            this.layerContainer.addChild(layerObj.layer);
        } else {
            this.layers.splice(index, 0, layerObj);
            this.layerContainer.addChildAt(layerObj.layer, index);
        }
        return layer;
    },
    getLayer: function (name) {
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].name === name) {
                return this.layers[i].layer;
            }
        }
    },
    removeLayer: function (name) {
        var layer;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].name === name) {
                layer = this.layers[i];
                this.layers.splice(i, 1);
                this.layerContainer.removeChild(layer.layer);
                return(layer.layer);
            }
        }
    },
    removeAll: function () {
        for (var i = 0; i < this.layers.length; i++) {
            this.layerContainer.removeChild(this.layers[i].layer);
        }
        this.layers = [];
    },
    moveLayer: function (name, index) {
        var layer = this.removeLayer(name);
        if (!layer) {
            throw "Layer with name " + name + " not found";
        }
        this.addLayer(name, index, layer);
    }
};

module.exports = UI;
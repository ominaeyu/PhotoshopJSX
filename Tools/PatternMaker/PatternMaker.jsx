preferences.rulerUnits = Units.PIXELS;
    var RESOLUTION = 72;
    
    Init();
    
    ///
    function Init() {
        ShowWindow();
    }
    
    function ShowWindow() {
        //setting firtst window
        var win = new Window("dialog", "PatternMaker", [0, 0, 220, 160]);
        win.center();
    
        //dialog_A{width: , height: , x:, y: }
        win.dialog = win.add("panel", [20, 20, 200, 80], "素材の背景状態");
        win.dialog.selectA = win.dialog.add("radiobutton", { width: 80, height: 20, x: 20, y: 20 }, "最適");
        win.dialog.selectB = win.dialog.add("radiobutton", { width: 80, height: 20, x: 100, y: 20 }, "不透明");
        win.dialog.selectA.value = true;
        win.dialog.layerName = win.dialog.add("statictext", { width: 120, height: 20, x: 40, y: 18 }, activeDocument.activeLayer.name);
    
        win.scale = win.add("statictext", { width: 120, height: 20, x: 25, y: 90 }, "レイヤースケール(1~100)");
        win.inputText = win.add("edittext", { width: 30, height: 20, x: 150, y: 90 }, 50);
        win.scale.justify = "right";
        win.percent = win.add("statictext", { width: 50, height: 20, x: 185, y: 90 }, "%");
    
        win.inputText.onChange = function () {
            if (parseInt(win.inputText.text) < 1) {
                win.inputText.text = 1;
            } else if (parseInt(win.inputText.text) > 100) {
                win.inputText.text = 100;
            }
        }
   
        win.cancelBtn = win.add("button", { width: 90, height: 20, x: 15, y: 120 }, "閉じる");
        win.okBtn = win.add("button", { width: 90, height: 20, x: 115, y: 120 }, "作成");
    
        //Button:Ok
        win.okBtn.onClick = function () {
            CreatePattern(win);
        }
       
        //Button:cancle
        win.cancelBtn.onClick = function () { win.close(); }
    
    
        //show Window
        win.show();
    }
    
    //Select Layer
    function SelectLayer(positive) {
        var activeIndex = 0;
        for (var i = 0; i < ActiveDocument.layers.length; i++) {
            if (ActiveDocument.layers[i] == ActiveDocument.ActiveLayer) {
                activeIndex = i;
            }
        }
    
        if (positive) {
            activeIndex++;
        } else {
            activeIndex--;
        }
    
        if (activeIndex > ActiveDocument.layers.length) activeIndex = ActiveDocument.layers.length - 1;
        if (activeIndex < 0) activeIndex = 0;
    
        Activedocument.ActiveLayer = Activedocument.layers[activeIndex];
    }
    
    //Create
    function CreatePattern(win) {
        var activeDoc = activeDocument;
        var W = activeDoc.width.value;
        var H = activeDoc.height.value;
        var activeLayer = activeDoc.activeLayer;
        var activeLayerBounds = activeLayer.bounds;
    
        var ax1 = parseInt(activeLayerBounds[0], 10);
        var ay1 = parseInt(activeLayerBounds[1], 10);
        var ax2 = parseInt(activeLayerBounds[2], 10);
        var ay2 = parseInt(activeLayerBounds[3], 10);
    
        var layerW = ax2 - ax1;
        var layerH = ay2 - ay1;
    
        var posX_l = W / 2;
        var posX_r = W - posX_l;
        var posY_u = H / 2;
        var posY_d = H - posY_u;
    
        var squareSize = layerW;
        if (layerH > layerW) squareSize = layerH;
    
        var targetLayer = activeDoc.activeLayer;
        targetLayer.opacity = 100;
        //Duplicate Document
        var newDoc = activeDoc.duplicate("pattern_scale_" + win.inputText.text);
    
        //resize
        newDoc.resizeCanvas(squareSize, squareSize);
    
        newDocLayer = newDoc.activeLayer;
        newDocLayer.resize(parseInt(win.inputText.text), parseInt(win.inputText.text));
        newDocLayerBounds = newDocLayer.bounds;
        ax1 = parseInt(newDocLayerBounds[0], 10);
        ay1 = parseInt(newDocLayerBounds[1], 10);
        ax2 = parseInt(newDocLayerBounds[2], 10);
        ay2 = parseInt(newDocLayerBounds[3], 10);
    
        //layer to Center
        newDocLayer.translate(0, 0);
    
        newDocLayer.translate(-ax1 + (squareSize - (ax2 - ax1)) / 2, -ay1 + (squareSize - (ay2 - ay1)) / 2);
        var newDocLayers = newDoc.layers;
    
        //layer rename
        newDocLayer.name += "_pattern";
        var targetName = newDocLayer.name;
        //find index
        do {
            if (newDocLayers[0].name != targetName) newDocLayers[0].remove();
            if (newDocLayers[newDocLayers.length - 1].name != targetName) newDocLayers[newDocLayers.length - 1].remove();
        } while (newDocLayers.length > 1);
    
        //Duplicate pattern Image
        for (var i = 0; i < 4; i++) {
            var cloneLayer = newDocLayer.duplicate();
            cloneLayer.name = "index_" + i;
        }
        newDocLayers[0].translate(-squareSize / 2, -squareSize / 2,);
        newDocLayers[1].translate(squareSize / 2, squareSize / 2,);
        newDocLayers[2].translate(-squareSize / 2, squareSize / 2,);
        newDocLayers[3].translate(squareSize / 2, -squareSize / 2,);
        win.close();
    }
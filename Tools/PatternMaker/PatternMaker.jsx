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
    win.dialog.selectA = win.dialog.add("radiobutton", { width: 80, height: 20, x: 20, y: 20 }, "透明");
    win.dialog.selectB = win.dialog.add("radiobutton", { width: 80, height: 20, x: 100, y: 20 }, "不透明");
    win.dialog.selectA.value = true;

    win.cBox1 = win.add("checkbox", { width: 200, height: 20, x: 30, y: 90 }, "正方形にする");
    win.cBox1.value = true;

    win.cancelBtn = win.add("button", { width: 90, height: 20, x: 15, y: 120 }, "キャンセル");
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
    //if layer Transparency, scale to 0.5
    if (win.dialog.selectB.value) {
        targetLayer.resize(50, 50);
    }
    //Duplicate Document
    var newDoc = activeDoc.duplicate("pattern");
    //var newDoc = documents.add(squareSize,squareSize);
    //documents.addlayer
    //targetLayer.duplicate(activeDocument,ElementPlacement.PLACEAFTER );
    //layObj = newDoc.artLayers.add();
    //layObj.link(targetLayer);

    //resize
    newDoc.resizeCanvas(squareSize, squareSize);

    newDocLayer = newDoc.activeLayer;
    newDocLayerBounds = newDocLayer.bounds;
    ax1 = parseInt(newDocLayerBounds[0], 10);
    ay1 = parseInt(newDocLayerBounds[1], 10);
    ax2 = parseInt(newDocLayerBounds[2], 10);
    ay2 = parseInt(newDocLayerBounds[3], 10);

    //layer to Center
    newDocLayer.translate(0, 0);

    newDocLayer.translate(-ax1 + (squareSize - (ax2 - ax1)) / 2, -ay1 + (squareSize - (ay2 - ay1)) / 2);
    var newDocLayers = newDoc.layers;

    var layerIndex = 0;
    newDocLayer.name += "pattern";
    var targetName = newDocLayer.name;
    alert("targetName" + targetName);
    //find index
    do {
        if (newDocLayers[0].name != targetName) newDocLayers[0].remove();
        if (newDocLayers[newDocLayers.length-1].name != targetName) newDocLayers[newDocLayers.length-1].remove();
    } while (newDocLayers.length > 1);
    return;

    for (var i = 0; i < 4; i++) {
        alert("d");
        var cloneLayer = newDoc.artLayers.add();
        cloneLayer = targetLayer.duplicate();
    }
    alert("c");


    alert(posX_l + "," + posX_r + "," + posY_u + "," + posY_d);

}
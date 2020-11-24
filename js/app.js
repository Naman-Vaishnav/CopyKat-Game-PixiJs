let app;
let start;
let red, green, blue, yellow;

var color = ["red", "blue", "green", "yellow"];
var seq = [0, 1, 2, 3];
var userSeq = [];
var userTurn = false;
var curStage = 0;
var timeOut = false;
var wrongInput = false;
var startflag = false;

window.onload = function () {
    app = new PIXI.Application({
        width: 600,
        height: 600,
        backgroundColor: 0xffffff,
    });
    document.querySelector("#gameDiv").appendChild(app.view);

    app.loader.baseUrl = "images";
    app.loader
        .add("red", "red.png")
        .add("green", "green.png")
        .add("blue", "blue.png")
        .add("yellow", "yellow.png")
        .add("start", "start.png")
        .add("black", "black.png")
        .add("reset", "reset.PNG");
    app.loader.onComplete.add(doneLoading);
    app.loader.load();

    function timeout(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }

    // Text Elements

    const gameName = new PIXI.Text("CopyKat");
    gameName.anchor.set(0.5);
    gameName.x = 300;
    gameName.y = 30;
    gameName.style = new PIXI.TextStyle({
        fontFamily: "Arcade",
        fontSize: 70,
    });
    app.stage.addChild(gameName);

    const level = new PIXI.Text("Level 1");
    level.anchor.set(0.5);
    level.x = 100;
    level.y = 500;
    level.style = new PIXI.TextStyle({
        fontFamily: "Arcade",
        fontSize: 50,
    });
    function setLevel(val) {
        level.text = "Level " + val;
    }
    app.stage.addChild(level);

    const gameStatus = new PIXI.Text("Press play to start");
    gameStatus.anchor.set(0.5);
    gameStatus.x = 300;
    gameStatus.y = 80;
    gameStatus.style = new PIXI.TextStyle({
        fontFamily: "Arcade",
        fontSize: 50,
    });
    function setStatus(val) {
        gameStatus.text = val;
    }
    app.stage.addChild(gameStatus);

    const score = new PIXI.Text("Score:0");
    score.anchor.set(0.5);
    score.x = 500;
    score.y = 500;
    score.style = new PIXI.TextStyle({
        fontFamily: "Arcade",
        fontSize: 50,
    });
    function setScore(val) {
        score.text = "Score:" + val;
    }
    app.stage.addChild(score);



    function startGame() {
        if (userTurn) {
            userSeq = [];

            checkSeq().then(() => {
                console.log("start");
                userTurn = false;
                setScore(curStage * 10);
                if (curStage < 4 && timeOut == false && wrongInput == false)
                    startGame();
                else if (timeOut || wrongInput) reset();
                else if (curStage == 4) {
                    console.log("win");
                    setStatus("You Won!");
                    reset();
                } else reset();
            });
        } else {
            showSeq().then(() => {
                curStage++;
                ///console.log(curStage);

                userTurn = true;
                if (curStage <= 4) startGame();
            });
        }
    }

    async function checkSeq() {
        await timeout(curStage * 700 + 900).then(() => {
            for (var i = 0; i < curStage; i++) {
                console.log(userSeq, curStage);
                console.log(userSeq[i], seq[i]);
                if (userSeq.length < curStage) {
                    timeOut = true;
                    console.log("timeout");
                    setStatus("Timeout!");

                    return;
                } else if (userSeq[i] != seq[i]) {
                    wrongInput = true;
                    console.log("wrong ");
                    setStatus("Wrong Sequence!");

                    return;
                }
            }
        });
    }

    function reset() {
        console.log("reset");
        userSeq = [];
        curStage = 0;
        userTurn = false;
        timeOut = false;
        wrongInput = false;
        startflag = false;
        setLevel(1);
        setScore(0);
        //setStatus("Press play to start")
        start.texture = app.loader.resources["start"].texture;
    }

    async function showSeq() {
        setLevel(curStage + 1);
        setStatus("Match the Sequence");
        for (var i = 0; i <= curStage; i++) {
            //console.log(seq[i]);
            switch (seq[i]) {
                case 0:
                    red.texture = app.loader.resources["black"].texture;
                    await timeout(1000).then(() => {
                        red.texture = app.loader.resources["red"].texture;
                    });

                    break;

                case 1:
                    blue.texture = app.loader.resources["black"].texture;
                    await timeout(1000).then(() => {
                        blue.texture = app.loader.resources["blue"].texture;
                    });
                    break;

                case 2:
                    green.texture = app.loader.resources["black"].texture;
                    await timeout(1000).then(() => {
                        green.texture = app.loader.resources["green"].texture;
                    });
                    break;

                case 3:
                    yellow.texture = app.loader.resources["black"].texture;
                    await timeout(1000).then(() => {
                        yellow.texture = app.loader.resources["yellow"].texture;
                    });
            }
        }
    }

    function doneLoading() {
        start = new PIXI.Sprite.from(app.loader.resources["start"].texture);
        start.width = 100;
        start.height = 100;
        start.x = 260;
        start.y = 110;
        start.interactive = true;
        start.buttonMode = true;
        start.on("pointerup", startUp);
        start.on("pointerdown", startDown);

        function startUp() {
            // startflag=false;
            //start.texture=app.loader.resources["start"].texture;
        }
        function startDown() {
            if (!startflag) {
                startflag = true;
                start.texture = app.loader.resources["reset"].texture;
                setTimeout(() => startGame(), 500);
            } else {
                console.log(startflag);
                reset();
            }
        }
        app.stage.addChild(start);

        red = new PIXI.Sprite.from(app.loader.resources["red"].texture);

        red.width = 100;
        red.height = 100;
        red.x = 200;
        red.y = 230;
        red.interactive = true;
        red.buttonMode = true;
        red.on("pointerup", redUp);
        red.on("pointerdown", redDown);

       
        function redUp() {
            Redflag = false;
            red.texture = app.loader.resources["red"].texture;
        }
        function redDown() {
            Redflag = true;
            red.texture = app.loader.resources["black"].texture;
            userSeq.push(0);
        }
        app.stage.addChild(red);

        green = new PIXI.Sprite.from(app.loader.resources["green"].texture);

        green.width = 100;
        green.height = 100;
        green.x = 300;
        green.y = 230;
        green.interactive = true;
        green.buttonMode = true;
        green.on("pointerup", greenUp);
        green.on("pointerdown", greenDown);

        var greenflag = false;
        function greenUp() {
            greenflag = false;
            green.texture = app.loader.resources["green"].texture;
        }
        function greenDown() {
            greenflag = true;
            green.texture = app.loader.resources["black"].texture;
            userSeq.push(2);
        }

        app.stage.addChild(green);

        yellow = new PIXI.Sprite.from(app.loader.resources["yellow"].texture);

        yellow.width = 100;
        yellow.height = 100;
        yellow.x = 200;
        yellow.y = 330;
        yellow.interactive = true;
        yellow.buttonMode = true;
        yellow.on("pointerup", yellowUp);
        yellow.on("pointerdown", yellowDown);

        var yellowflag = false;
        function yellowUp() {
            yellowflag = false;
            yellow.texture = app.loader.resources["yellow"].texture;
        }
        function yellowDown() {
            yellowflag = true;
            yellow.texture = app.loader.resources["black"].texture;
            userSeq.push(3);
        }
        app.stage.addChild(yellow);

        blue = new PIXI.Sprite.from(app.loader.resources["blue"].texture);

        blue.width = 100;
        blue.height = 100;
        blue.x = 300;
        blue.y = 330;
        blue.interactive = true;
        blue.buttonMode = true;
        blue.on("pointerup", blueUp);
        blue.on("pointerdown", blueDown);

        var blueflag = false;
        function blueUp() {
            blueflag = false;
            blue.texture = app.loader.resources["blue"].texture;
        }
        function blueDown() {
            blueflag = true;
            blue.texture = app.loader.resources["black"].texture;
            userSeq.push(1);
        }
        app.stage.addChild(blue);
    }
};

let app;
let start, red, green, blue, yellow;
var color = ["red", "blue", "green", "yellow"];
var seq = [0, 1, 2, 3];
var userSeq = [];
var userTurn = false;
var curStage = 0;
var timeOut = false;
var wrongInput = false;
var startflag, redflag, greenflag, blueflag, yellowflag = false;

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

    function createText(text, x, y, size) {
        const temp = new PIXI.Text(text);
        temp.anchor.set(0.5);
        temp.x = x;
        temp.y = y;
        temp.style = new PIXI.TextStyle({
            fontFamily: "Arcade",
            fontSize: size,
        });
        return temp;
    }

    const gameName = createText("CopyKat", 300, 30, 70);
    app.stage.addChild(gameName);

    const level = createText("Level 1", 100, 500, 50);
    app.stage.addChild(level);
    function setLevel(val) {
        level.text = "Level " + val;
    }

    const gameStatus = createText("Press play to start", 300, 80, 50);
    app.stage.addChild(gameStatus);
    function setStatus(val) {
        gameStatus.text = val;
    }

    const score = createText("Score:0", 500, 500, 50);
    app.stage.addChild(score);
    function setScore(val) {
        score.text = "Score:" + val;
    }


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

        function createSprite(resourceName, x, y) {
            const temp = new PIXI.Sprite.from(app.loader.resources[resourceName].texture);
            temp.width = 100;
            temp.height = 100;
            temp.x = x;
            temp.y = y;
            temp.interactive = true;
            temp.buttonMode = true;
            return temp;
        }
        start = createSprite("start", 260, 110);
        start.on("pointerdown", startDown);
        app.stage.addChild(start);
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

        red = createSprite("red", 200, 230);
        red.on("pointerup", redUp);
        red.on("pointerdown", redDown);
        app.stage.addChild(red);
        function redUp() {
            redflag = false;
            red.texture = app.loader.resources["red"].texture;
        }
        function redDown() {
            redflag = true;
            red.texture = app.loader.resources["black"].texture;
            userSeq.push(0);
        }

        green = createSprite("green", 300, 230);
        green.on("pointerup", greenUp);
        green.on("pointerdown", greenDown);
        app.stage.addChild(green);
        function greenUp() {
            greenflag = false;
            green.texture = app.loader.resources["green"].texture;
        }
        function greenDown() {
            greenflag = true;
            green.texture = app.loader.resources["black"].texture;
            userSeq.push(2);
        }

        yellow = createSprite("yellow", 200, 330);
        yellow.on("pointerup", yellowUp);
        yellow.on("pointerdown", yellowDown);
        app.stage.addChild(yellow);
        function yellowUp() {
            yellowflag = false;
            yellow.texture = app.loader.resources["yellow"].texture;
        }
        function yellowDown() {
            yellowflag = true;
            yellow.texture = app.loader.resources["black"].texture;
            userSeq.push(3);
        }

        blue = createSprite("blue", 300, 330);
        blue.on("pointerup", blueUp);
        blue.on("pointerdown", blueDown);
        app.stage.addChild(blue);
        function blueUp() {
            blueflag = false;
            blue.texture = app.loader.resources["blue"].texture;
        }
        function blueDown() {
            blueflag = true;
            blue.texture = app.loader.resources["black"].texture;
            userSeq.push(1);
        }
    }
};

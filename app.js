const c = document.getElementById("myCanvas");
const canvasWidth = c.width;
const canvasHeight = c.height;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;
//產生隨機數的方法
//min,max
function getRandomArbitraryNumber(min, max) {
    return min + Math.floor(Math.random() * (max - min));

}

class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        brickArray.push(this);
        this.visible = true;
    }
    //畫出磚塊的方法
    drawBrick() {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //確認磚塊有沒有被球打到
    touchingBall(ballX, ballY) {
        return (
            ballX >= this.x - radius &&
            ballX <= this.x + this.width + radius &&
            ballY <= this.y + this.height + radius &&
            ballY >= this.y - radius
        );
    }
}
//製作所有磚塊物件(製作滿10個都不重複的磚塊後就停止)
do {
    let x = getRandomArbitraryNumber(0, 950);
    let y = getRandomArbitraryNumber(0, 550);
    new Brick(x, y);

    //判斷磚塊位置是否有重疊
    brickArray.forEach((brick, index) => {
        // console.log("目前陣列長度" + brickArray.length);
        let compareArray = brickArray.filter((item) => {
            return brick.x !== item.x && brick.y !== item.y
        })
        compareArray.forEach((item) => {
            //拿brick磚塊跟9個item磚塊做比較，刪除掉重疊的磚塊
            if (item.x >= brick.x - brick.width &&
                item.x <= brick.x + brick.width + item.width &&
                item.y >= brick.y - item.height &&
                item.y <= brick.y + item.height
            ) {
                // console.log("刪除");
                brickArray.pop(index);
            }

        })
    })
}
while (brickArray.length < 10);




//添加事件讓滑鼠能夠控制地板
c.addEventListener("mousemove", (e) => {
    c.style = "cursor: pointer";
    ground_x = e.clientX;
})
//剩餘數量轉換工具
function amountTool(count) {
    if (count === 0) {
        return 10
    }
    if (count === 1) {
        return 9
    }
    if (count === 2) {
        return 8
    }
    if (count === 3) {
        return 7
    }
    if (count === 4) {
        return 6
    }
    if (count === 5) {
        return 5
    }
    if (count === 6) {
        return 4
    }
    if (count === 7) {
        return 3
    }
    if (count === 8) {
        return 2
    }
    if (count === 9) {
        return 1
    }
    if (count === 10) {
        return 0
    }

}
function drawCircle() {
    //確認球是否有打到磚塊
    brickArray.forEach((brick) => {
        if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
            count++;
            document.getElementById("text").innerText = "Remaining Amount:" + amountTool(count);;
            brick.visible = false;
            //改變x,y方向速度，並且將brick從brickArray中移除
            // 從下方撞擊
            if (circle_y >= brick.y + brick.height) {
                ySpeed *= -1;
            }
            // 從上方撞擊
            else if (circle_y <= brick.y) {
                ySpeed *= -1;
            }
            // 從左方撞擊
            else if (circle_x <= brick.x) {
                xSpeed *= -1;
            }
            // 從右方撞擊
            else if (circle_x >= brick.x + brick.width) {
                xSpeed *= -1;
            }
            //打滿磚塊後遊戲結束
            if (count === 10) {
                alert("Win!" + seconds + "seconds");
                clearInterval(game);
                clearInterval(stopWatch);
            }
        }
    })
    //確認球是否打到橘色地板反彈
    if (
        circle_x >= ground_x - radius &&
        circle_x <= ground_x + 200 + radius &&
        circle_y >= ground_y - radius &&
        circle_y <= ground_y + radius
    ) {
        if (ySpeed > 0) {
            circle_y -= 50;
        } else {
            circle_y += 50;
        }
        ySpeed *= -1;
    }

    //確認球是否打到牆壁反彈
    // 確認右邊邊界
    if (circle_x >= canvasWidth - radius) {
        xSpeed *= -1;
    }
    // 確認左邊邊界
    if (circle_x <= radius) {
        xSpeed *= -1;
    }
    // 確認上邊邊界
    if (circle_y <= radius) {
        ySpeed *= -1;
    }
    // 確認下邊邊界
    if (circle_y >= canvasHeight - radius) {
        ySpeed *= -1;
    }
    // 更動圓的座標
    circle_x += xSpeed;
    circle_y += ySpeed;

    //畫出黑色背景
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    //畫出所有的磚塊
    brickArray.forEach((brick) => {
        if (brick.visible) {
            brick.drawBrick();
        }
    });

    //畫出可控制的地板
    ctx.fillStyle = "orange";
    ctx.fillRect(ground_x, ground_y, 200, ground_height);

    //畫出圓球
    //x,y,radius,startAngle,endAngle
    ctx.beginPath();
    ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();
}

let game = setInterval(drawCircle, 25);

//製作碼表
// 計時的方法
seconds = 0;
function timer() {
    seconds++
}
let stopWatch = setInterval(timer, 1000);

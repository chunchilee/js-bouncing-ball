const canvas = document.getElementById("myCanvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");

let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 150;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];

function draw() {
  //超出邊界
  if (circle_x + radius >= canvasWidth || circle_x - radius <= 0) {
    xSpeed *= -1;
  } else if (circle_y + radius >= canvasHeight || circle_y - radius <= 0) {
    ySpeed *= -1;
  }
  //球碰到地板
  if (
    circle_x + radius >= ground_x &&
    circle_x - radius <= ground_x + 200 &&
    circle_y + radius >= ground_y &&
    circle_y - radius <= ground_y + 5
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }
  //球碰到磚塊
  brickArray.forEach((brick, index) => {
    if (
      circle_x + radius >= brick.x &&
      circle_x - radius <= brick.x + brick.width &&
      circle_y + radius >= brick.y &&
      circle_y - radius <= brick.y + brick.height
    ) {
      //碰到哪邊
      if (circle_x < brick.x || circle_x > brick.x + brick.width) {
        xSpeed *= -1;
      } else if (circle_y < brick.y || circle_y > brick.y + brick.height) {
        ySpeed *= -1;
      }
      brickArray.splice(index, 1);
      if (brickArray.length == 0) {
        clearInterval(game);
        setTimeout(() => alert("遊戲結束"));
      }
    }
  });

  //讓球動
  circle_x += xSpeed;
  circle_y += ySpeed;

  //圖的形狀
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.fillStyle = "red";
  ctx.fillRect(ground_x, ground_y, 200, 5);
  brickArray.forEach((brick) => {
    brick.drawBrick();
  });
}
let game = setInterval(draw, 50);
//控制地版
window.addEventListener("mousemove", (e) => (ground_x = e.clientX));

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    brickArray.push(this);
  }

  drawBrick() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
function arbitraryBrick(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
for (let i = 0; i < 10; i++) {
  new Brick(arbitraryBrick(0, 960), arbitraryBrick(0, 560));
} 

//方法一
  //brick.splice() //O(n) 數據變多的話，不理想
//方法二
  //讓brick從畫面不見，但brickArray長度不變，沒有資料被刪除
    //let count=0
    //再constructor內新增this.visible=true的屬性
    //brickArray.forEach(()=>{
      //如果球碰到brick，就新增this.visible=false的屬性
      //count++
      //if(count==brick的數量){結束}
    //})
    //形成圖的畫面時，brickArray.forEach((brick)=>{ if(brick.visible) })

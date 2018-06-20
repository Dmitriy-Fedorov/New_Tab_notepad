var canvas = document.querySelector('canvas');
//console.log(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

//console.log(c)
var selector = true;
var counter = 0;
var squareSize = 5;
var mouse = {x: undefined, y: undefined};
var click = {x: undefined, y: undefined};
var mDown = false;
var mUp = false;
var averRadius = 5;
var conwaySelector = 0;
var conwayDelay = 100;

var colorArray = [
    '#020E17',
    '#0E5159',
    '#09736A',
    '#15AB89',
    "#76D9B9"
];
/***************************** PROTOTYPES *************************************************************/
String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
};

Object.defineProperty(Array.prototype, '-1', {
    get: function () { return this[this.length - 1] }
});
Object.defineProperty(Array.prototype, '-2', {
    get: function () { return this[this.length - 2] }
});
Object.defineProperty(Array.prototype, '-3', {
    get: function () { return this[this.length - 3] }
});
Object.defineProperty(Array.prototype, '-4', {
    get: function () { return this[this.length - 4] }
});
Object.defineProperty(Array.prototype, '-5', {
    get: function () { return this[this.length - 5] }
});
Object.defineProperty(Array.prototype, '-6', {
    get: function () { return this[this.length - 6] }
});
Object.defineProperty(Array.prototype, '-7', {
    get: function () { return this[this.length - 7] }
});
Object.defineProperty(Array.prototype, '-8', {
    get: function () { return this[this.length - 8] }
});
/****************************************EVENT LISTENERS*************************************************************/
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
        //console.log(mouse);
        //console.log(click);
        /*
        if(mDown){
            if(!selector){
                x = Math.floor(mouse.x/squareSize);
                y = Math.floor(mouse.y/squareSize);
                convey.mas[y][x]=1;
                convey.drawField();
            }
        }*/

});

window.addEventListener('mousedown',
    function (ev) {
        mUp = false;
        mDown = true;
        //console.log('mousedown',mUp,mDown);
    });

window.addEventListener('mouseup',
    function (ev) {
        mUp = true;
        mDown = false;
        //console.log('mouseup',mUp,mDown);
    });

window.addEventListener('click',
    function(event) {
        click.x = mouse.x;
        click.y = mouse.y;
        //console.log(click);


        if(!selector){
            x = Math.floor(mouse.x/squareSize);
            y = Math.floor(mouse.y/squareSize);
            if(conwaySelector === 0) convey.addGlider(x,y);
            else if(conwaySelector===1) convey.addAcorn(x,y);
            else if(conwaySelector===2) convey.addDieHard(x,y);
            else if(conwaySelector===3) convey.addGun2(x,y);
            else if(conwaySelector===4) convey.gosperGliderGun(x,y);
            convey.drawField();
        }
        if(mouse.x < 3){
            selector = !selector;
            //console.log(selector);
            if(selector){
                animate();
            }
        }

    }
);

window.addEventListener('mousewheel',
    function (ev) {
        //console.log(ev);
        if(ev.deltaY > 0){
            if(conwaySelector < 10)
                conwaySelector++;
        }else{
            if(conwaySelector > 0)
                conwaySelector--;
        }
        console.log(conwaySelector);
    });

window.addEventListener('resize',
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initCircleArray();
    }
);
/****************************************CIRCLE***********************************************************************/
function Circle(x, y, dx, dy, radius){
    //console.log('new circle');
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.dxMin = dx;
    this.dyMin = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.maxRadius = radius + Math.random()*5;
    this.color = colorArray[Math.floor(Math.random() * (colorArray.length-1) + 1)];

    this.draw = function(){
        //console.log('draw');
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = 'blue';
        // c.stroke;
        c.fillStyle = this.color;
        c.fill();
    };

    this.mouseOver = function(){
        return ( mouse.x - this.x < 70 &&
                 mouse.x - this.x > -70 &&
                 mouse.y - this.y < 70 &&
                 mouse.y - this.y > -70);
    };

    this.update = function(){
        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
                this.dx = -this.dx;
           }

        if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
                this.dy = -this.dy;
           }

        this.x += this.dx;
        this.y += this.dy;

        // interactivity
		if(mDown){
			if( this.mouseOver()){
				this.dx *= 1.5;
				this.dy *= 1.5;
			}else if(Math.abs(this.dx) > Math.abs(this.dxMin)){
				this.dx *= 0.9;
				this.dy *= 0.9;
			}
			/*
			if( click.x - this.x < 30 &&
				click.x - this.x > -30 &&
				click.y - this.y < 30 &&
				click.y - this.y > -30){
					click = {x: undefined, y: undefined};
					this.dx = this.dx + 10;
					this.dy = this.dy + 10;
				}*/
		}else if(Math.abs(this.dx) > Math.abs(this.dxMin)){
			this.dx *= 0.9;
			this.dy *= 0.9;
		}
        this.draw();
    }
}

var circleArray = [];
function initCircleArray(){
    circleArray = [];
    for(var i = 0; i < 1200; i++){
        var radius = Math.random() * averRadius + 1;
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = Math.random() - 0.5;
        var dy = Math.random() - 0.5;
        circleArray.push(new Circle(x, y, dx, dy, radius));
    }
}

/***************************************CANVAS GAME OF LIFE***********************************************************/
drawField = function(mas,m,n, squareSize){
        c.clearRect(0, 0, innerWidth, innerHeight);
        c.fillStyle = colorArray[0];
        c.fillRect(0, 0, innerWidth, innerHeight);
        for (var i=0; i<m; i++){
            for (var j=0; j<n; j++){
                if (mas[i][j]===1){
                    //c.fillStyle = colorArray[3];
                    c.fillStyle = colorArray[Math.floor(Math.random()*4+1)];
                    c.fillRect(j*squareSize, i*squareSize, squareSize, squareSize);
                }
            }
        }
    };

function ConveyGameOfLife(squareSize) {
    this.m = Math.floor(canvas.height / squareSize); //height
    this.n = Math.floor(canvas.width / squareSize); //width
    console.log('n:', this.n, 'm:', this.m);
    this.mas = [];
    this.squareSize = squareSize;

    this.goLife = function () {
        for (var i = 0; i < this.m; i++) {
            this.mas[i] = [];
            for (var j = 0; j < this.n; j++) {
                //this.mas[i][j] = Math.round(Math.random());
                this.mas[i][j] = 0;
            }
        }
    };
    this.goLife();

    this.drawField = function () {
        c.clearRect(0, 0, innerWidth, innerHeight);
        c.fillStyle = colorArray[0];
        c.fillRect(0, 0, innerWidth, innerHeight);
        for (var i = 0; i < this.m; i++) {
            for (var j = 0; j < this.n; j++) {
                if (this.mas[i][j] === 1) {
                    //c.fillStyle = colorArray[3];
                    c.fillStyle = colorArray[Math.floor(Math.random() * 4 + 1)];
                    c.fillRect(j * this.squareSize, i * this.squareSize, this.squareSize, this.squareSize);
                }
            }
        }
    };

    this.yUp = function (i) { //up
        if (i === 0) return this.m;
        else return i;
    };
    this.yBot = function (i) { //bottom
        if (i === this.m - 1) return -1;
        else return i;
    };
    this.xLeft = function (i) { //left
        if (i === 0) return this.n;
        else return i;
    };
    this.xRight = function (i) { //right
        if (i === this.n - 1) return -1;
        else return i;
    };

    this.up = function (x, y) {
        //console.log(arguments);
        if (arguments.length > 2)
            this.mas[this.yUp(y) - 1][x] = arguments[2];
        else
            return this.mas[this.yUp(y) - 1][x];
    };
    this.down = function (x, y) {
        //console.log(arguments);
        if (arguments.length > 2)
            this.mas[this.yBot(y) + 1][x] = arguments[2];
        else
            return this.mas[this.yBot(y) + 1][x];
    };
    this.left = function (x, y) {
        //console.log(arguments);
        if (arguments.length > 2)
            this.mas[y][this.xLeft(x) - 1] = arguments[2];
        else
            return this.mas[y][this.xLeft(x) - 1];
    };
    this.right = function (x, y) {
        //console.log(arguments);
        if (arguments.length > 2)
            this.mas[y][this.xRight(x) + 1] = arguments[2];
        else
            return this.mas[y][this.xRight(x) + 1];
    };
    this.upLeft = function (x, y) {
        //console.log(arguments);
        if (arguments.length > 2)
            this.mas[this.yUp(y) - 1][this.xLeft(x) - 1] = arguments[2];
        else
            return this.mas[this.yUp(y) - 1][this.xLeft(x) - 1];
    };
    this.upRight = function (x, y) {
        //console.log(arguments);
        if (arguments.length > 2)
            this.mas[this.yUp(y) - 1][this.xRight(x) + 1] = arguments[2];
        else
            return this.mas[this.yUp(y) - 1][this.xRight(x) + 1];
    };
    this.downLeft = function (x, y) {
        //console.log(arguments);
        if (arguments.length > 2)
            this.mas[this.yBot(y) + 1][this.xLeft(x) - 1] = arguments[2];
        else
            return this.mas[this.yBot(y) + 1][this.xLeft(x) - 1];
    };
    this.downRight = function (x, y) {
        //console.log(arguments, arguments.length);
        if (arguments.length > 2)
            this.mas[this.yBot(y) + 1][this.xRight(x) + 1] = arguments[2];
        else
            return this.mas[this.yBot(y) + 1][this.xRight(x) + 1];
    };

    this.rotateLeft = function (x, y) {
        // 0xx   0x0
        // xx0   0xx
        // 00x   x0x
        ////////
        var up = 0, mid = 1, bot = 2;
        var temp = [];
        temp[up] = [];
        temp[mid] = [];
        temp[bot] = [];
        temp[up][0] = this.upRight(x, y); //+
        temp[up][1] = this.right(x, y); //+
        temp[up][2] = this.downRight(x, y); //+
        temp[mid][0] = this.up(x, y); //+
        temp[mid][1] = this.mas[y][x]; //+
        temp[mid][2] = this.down(x, y); //-
        temp[bot][0] = this.upLeft(x, y);
        temp[bot][1] = this.left(x, y);
        temp[bot][2] = this.downLeft(x, y);
        //console.log(temp);
        //console.log(this.mas);
        this.upLeft(x, y, temp[0][0]);
        this.up(x, y, temp[0][1]);
        this.upRight(x, y, temp[0][2]);
        this.right(x, y, temp[1][2]);
        this.downRight(x, y, temp[2][2]);
        this.down(x, y, temp[2][1]);
        this.downLeft(x, y, temp[2][0]);
        this.left(x, y, temp[1][0]);
        //console.log(this.mas);
    };

    /*this.startLife = function(selector){
        //моделирование жизни
        var mas2 = [];
        for (var i=0; i<this.m; i++){
            mas2[i]=[];
            for (var j=0; j<this.n; j++){
                var neighbors = 0;
                if (this.mas[this.yUp(i)-1][j]===1) neighbors++;//up
                if (this.mas[i][this.xRight(j)+1]===1) neighbors++;//right
                if (this.mas[this.yBot(i)+1][j]===1) neighbors++;//bottom
                if (this.mas[i][this.xLeft(j)-1]===1) neighbors++;//left
                if (this.mas[this.yUp(i)-1][this.xRight(j)+1]===1) neighbors++;
                if (this.mas[this.yBot(i)+1][this.xRight(j)+1]===1) neighbors++;
                if (this.mas[this.yBot(i)+1][this.xLeft(j)-1]===1) neighbors++;
                if (this.mas[this.yUp(i)-1][this.xLeft(j)-1]===1) neighbors++;
                //Survival rules
                if(this.mas[i][j]===0 && neighbors===3){
                    mas2[i][j] = 1;
                }else if(neighbors<2 || neighbors>3){
                    mas2[i][j] = 0;
                }else{
                    mas2[i][j] = this.mas[i][j];
                }
            }
        }
        this.mas = mas2;
        console.log('inside', this, this.drawField);
        drawField(this.mas,this.m,this.n,this.squareSize);
        if(!selector){
            setTimeout(this.startLife, 300);
        }
        //console.log('counter',counter);
    };*/

    this.addGlider = function (x, y) {
        /*
        * 0x0
        * 0xx
        * x0x
        * */
        try {
            this.mas[y][x] = 1; //center
            this.mas[this.yUp(y) - 1][x] = 1; //up
            this.mas[y][this.xRight(x) + 1] = 1; //right
            this.mas[this.yBot(y) + 1][this.xLeft(x) - 1] = 1; //bot-left
            this.mas[this.yBot(y) + 1][this.xRight(x) + 1] = 1; //bot-right
            var rotateNum = Math.random() * 5;
            //console.log(rotateNum);
            for (var i = 0; i < Math.round(rotateNum); i++) {
                this.rotateLeft(x, y);
            }
        } catch (e) {
            console.log('out of range', e);
        }
    };

    this.addAcorn = function (x, y) {
        /*
        * 0x00000
        * 000X000
        * xx00xxx
        * */
        try {
            this.mas[y][x] = 1; //center
            this.mas[this.yUp(y) - 1][this.xLeft(x - 1) - 1] = 1; //up-2left
            this.mas[this.yBot(y) + 1][this.xLeft(x) - 1] = 1; //bot-left
            this.mas[this.yBot(y) + 1][this.xLeft(x - 1) - 1] = 1; //bot-2left
            this.mas[this.yBot(y) + 1][this.xRight(x) + 1] = 1; //bot-1right
            this.mas[this.yBot(y) + 1][this.xRight(x + 1) + 1] = 1; //bot-2right
            this.mas[this.yBot(y) + 1][this.xRight(x + 2) + 1] = 1; //bot-3right
        } catch (e) {
            console.log('out of range', e);
        }
    };

    this.addDieHard = function (x, y) {
        /*
        * 000000x0
        * xx00C000
        * 0x000xxx
        * */
        try {
            masLengthY = this.mas.length;
            masLengthX = this.mas[0].length;
            this.mas[y][x - 3] = 1; //3left
            this.mas[y][x - 4] = 1; //4left
            this.mas[y - 1][(x + 2) % masLengthX] = 1; //up-2right
            this.mas[y + 1][x - 3] = 1; //bot-3left
            this.mas[y + 1][(x + 1) % masLengthX] = 1; //bot-1right
            this.mas[y + 1][(x + 2) % masLengthX] = 1; //bot-2right
            this.mas[y + 1][(x + 3) % masLengthX] = 1; //bot-3right
        } catch (e) {
            console.log('out of range', e);
        }
    };

    this.addGun2 = function (x, y) {
        /*
        * xxx0x
        * x0000
        * 00Cxx
        * 0xx0x
        * x0x0x
        * */
        try {
            var masLengthY = this.mas.length;
            var masLengthX = this.mas[0].length;
            this.mas[y - 2][x] = 1;
            this.mas[y - 2][x - 1] = 1;
            this.mas[y - 2][x - 2] = 1;
            this.mas[y - 2][(x + 2) % masLengthX] = 1;
            this.mas[y - 1][x - 2] = 1;
            this.mas[y][(x + 1) % masLengthX] = 1;
            this.mas[y][(x + 2) % masLengthX] = 1;
            this.mas[(y + 1) % masLengthY][x] = 1;
            this.mas[(y + 1) % masLengthY][x - 1] = 1;
            this.mas[(y + 1) % masLengthY][(x + 2) % masLengthX] = 1;
            this.mas[(y + 2) % masLengthY][x - 2] = 1;
            this.mas[(y + 2) % masLengthY][x] = 1;
            this.mas[(y + 2) % masLengthY][(x + 2) % masLengthX] = 1;
        } catch (e) {
            console.log('out of range', e);
        }
    };

    this.gosperGliderGunPart1 = function (x, y) {

        var masLengthY = this.mas.length;
        var masLengthX = this.mas[0].length;
        var x1 = (x + 1) % masLengthX;
        var x2 = (x + 2) % masLengthX;
        var x3 = (x + 3) % masLengthX;
        var x4 = (x + 4) % masLengthX;
        var y1 = (y + 1) % masLengthY;
        var y2 = (y + 2) % masLengthY;
        var y3 = (y + 3) % masLengthY;
        /*
        32XX1234
        3X101X34
        X21012X4
        X21SX2XX
        X21012X4
        3X101X34
        32XX1234
         */
        this.mas[y - 3][x - 1] = 1;
        this.mas[y - 3][x] = 1;
        this.mas[y - 2][x - 2] = 1;
        this.mas[y - 2][x2] = 1;
        this.mas[y - 1][x - 3] = 1;
        this.mas[y - 1][x3] = 1;
        this.mas[y][x - 3] = 1;
        this.mas[y][x1] = 1;
        this.mas[y][x3] = 1;
        this.mas[y][x4] = 1;
        this.mas[y1][x - 3] = 1;
        this.mas[y1][x3] = 1;
        this.mas[y2][x - 2] = 1;
        this.mas[y2][x2] = 1;
        this.mas[y3][x - 1] = 1;
        this.mas[y3][x] = 1;
    };

    this.gosperGliderGunPart2 = function (x, y) {

            var masLengthY = this.mas.length;
            var masLengthX = this.mas[0].length;
            var x1 = (x+1)%masLengthX;
            var x2 = (x+2)%masLengthX;
            var x3 = (x+2)%masLengthX;
            var x4 = (x+2)%masLengthX;
            var y1 = (y+1)%masLengthY;
            var y2 = (y+2)%masLengthY;
            var y3 = (y+3)%masLengthY;
            /*
            2101X   -3
            21X1X   -2
            XX...   -1
            XXS..   0
            XX...   1
            ..X.X   2
            ....X   3
            */
            this.mas[y - 3][x2] = 1;
            this.mas[y - 2][x] = 1;
            this.mas[y - 2][x2] = 1;
            this.mas[y - 1][x-2] = 1;
            this.mas[y - 1][x-1] = 1;
            this.mas[y][x-2] = 1;
            this.mas[y][x-1] = 1;
            this.mas[y1][x-2] = 1;
            this.mas[y1][x-1] = 1;
            this.mas[y2][x] = 1;
            this.mas[y2][x2] = 1;
            this.mas[y3][x2] = 1;
    };

    this.gosperGliderGun = function (x, y){
        var masLengthY = this.mas.length;
        var masLengthX = this.mas[0].length;
        var x24 = (x+24)%masLengthX;
        var x25 = (x+25)%masLengthX;
        var x3 = (x+3)%masLengthX;
        var y1 = (y+1)%masLengthY;
        this.mas[y][x-10] = 1;
        this.mas[y][x-9] = 1;
        this.mas[y1][x-10] = 1;
        this.mas[y1][x-9] = 1;
        this.gosperGliderGunPart1(x3,y1);
        this.gosperGliderGunPart2(x+12,y-1);
        this.mas[y-1][x25] = 1;
        this.mas[y-2][x25] = 1;
        this.mas[y-1][x24] = 1;
        this.mas[y-2][x24] = 1;
    }
}


convey = new ConveyGameOfLife(squareSize);
console.log(convey);

startLife = function(selector){
    //моделирование жизни
    var mas2 = [];
    for (var i=0; i<convey.m; i++){
        mas2[i]=[];
        for (var j=0; j<convey.n; j++){
            var neighbors = 0;
            if (convey.mas[convey.yUp(i)-1][j]===1) neighbors++;//up
            if (convey.mas[i][convey.xRight(j)+1]===1) neighbors++;//right
            if (convey.mas[convey.yBot(i)+1][j]===1) neighbors++;//bottom
            if (convey.mas[i][convey.xLeft(j)-1]===1) neighbors++;//left
            if (convey.mas[convey.yUp(i)-1][convey.xRight(j)+1]===1) neighbors++; //up-right
            if (convey.mas[convey.yBot(i)+1][convey.xRight(j)+1]===1) neighbors++; //down-right
            if (convey.mas[convey.yBot(i)+1][convey.xLeft(j)-1]===1) neighbors++; //down-left
            if (convey.mas[convey.yUp(i)-1][convey.xLeft(j)-1]===1) neighbors++; //up-left
            //Survival rules
            if(convey.mas[i][j]===0 && neighbors===3){
                mas2[i][j] = 1;
            }else if(neighbors<2 || neighbors>3){
                mas2[i][j] = 0;
            }else{
                mas2[i][j] = convey.mas[i][j];
            }
        }
    }
    convey.mas = mas2;
    //console.log('outside', convey, convey.drawField);
    drawField(convey.mas,convey.m,convey.n,convey.squareSize);
    if(!selector){
        setTimeout(startLife, conwayDelay);
    }
    //console.log('counter',counter);
};





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate(){
    //console.log('animate')
    if(selector){
        requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);
        c.fillStyle = colorArray[0];
        c.fillRect(0, 0, innerWidth, innerHeight);
        for(var i = 0; i < circleArray.length; i++){
            circleArray[i].update();
        }
    }else{
        //console.log('animate', convey, convey.startLife, convey.drawField);
        startLife(selector);
        //counter++;
        //console.log(counter);
    }


}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
initCircleArray();
animate();
console.log('animate');

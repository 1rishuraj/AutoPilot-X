class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3,color="blue"){// by def maxSpeed is 3
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speed=0;
        this.acceleration=0.2;
        this.maxspd=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;//initially no damage

        this.useBrain=controlType=="AI";//reads AI from main.js

        if(controlType!="DUMMY"){
        this.sensor=new Sensor(this);// no sensor for dummy car
               
        //explain******************
        this.brain=new NeuralNetwork(
            [this.sensor.rayCount,6,4] //input
        //giving layers
        //this.brain neural network has three layers: the input layer 
        //with a size equal to the number of rays in the sensor
        //hidden layer= 6  neurons 
        //o/p layer has 4 neurons(Forwrd Back Lt Rt)
        );
    
    
    }
        this.controls=new Controls(controlType)// defining new class

        this.img=new Image();
        this.img.src="car.png"
   
        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;

        const maskCtx=this.mask.getContext("2d");
        this.img.onload=()=>{
            maskCtx.fillStyle=color;
            maskCtx.rect(0,0,this.width,this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation="destination-atop";
            maskCtx.drawImage(this.img,0,0,this.width,this.height);
        }
        //The resulting effect is that the image is visible only within the area defined by the mask rectangle, while the rest of the
        //  canvas remains transparent or retains its previous content. 
   
    }

update(roadBorders,traffic){ //user defined fxn
    if(!this.damaged){  // this allows car movement valid till it does not touch borders
    this.#move();
    this.polygon=this.#createPolygon();
    this.damaged=this.#assessDamage(roadBorders,traffic);
    //damage assesed & car stops if hit traffic or border
    }
    if(this.sensor){// if car has sensor then sense borders by rays
    this.sensor.update(roadBorders,traffic);
    //sensor to sense traffic & border

    //explain******************
    const offsets=this.sensor.readings.map(
        s=>s==null?0:1-s.offset
     //   so if obstruct offset distance is less(near) (1-offset) value is closer to 1
     //   so if obstruct offset distance is high(far) 1-offset value is away from 1

     );
   
    const outputs=NeuralNetwork.feedForward(offsets,this.brain);
    // offset of obstruction given as input to neural network to suggest output for movement
    console.log(outputs);

    if(this.useBrain){
        this.controls.forward=outputs[0];
        this.controls.left=outputs[1];
        this.controls.right=outputs[2];
        this.controls.reverse=outputs[3];

    }//according to what the neural network returns o/p as 0 or 1 
    //car controls are provided as per outputs[] in forward/back/lt/rt
    }

}

#assessDamage(roadBorders,traffic){
    for(let i=0;i<roadBorders.length;i++){
        if(polysIntersect(this.polygon,roadBorders[i])){
            return true;
//if roadborder intersect with polygon ie. car rectangle return true
        }
    }
    for(let i=0;i<traffic.length;i++){
        if(polysIntersect(this.polygon,traffic[i].polygon)){
            return true;
//if traffic polygon intersect with polygon ie. car rectangle return true
        }
    }
    return false;
}

//to keep account of 4 corners of car
#createPolygon(){
    const points=[];
    const rad=Math.hypot(this.width,this.height)/2;
    const alpha=Math.atan2(this.width,this.height);
    points.push(
        {
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        }
    );
    points.push(
        {
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        }
    );
    points.push(
        {
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        }
    );
    points.push(
        {
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        }
    );
    return points;
}

#move(){
    if(this.controls.forward){
        this.speed+=this.acceleration;
        
    }
    if(this.controls.reverse){
        this.speed-=this.acceleration;
    }
    if(this.speed>this.maxspd){
        this.speed=this.maxspd;
    }
    if(this.speed<-this.maxspd/2){
    //speed in back direction considered -ve
        this.speed=-this.maxspd/2;
//making back maxspeed stagnant at half the max speed in forward direction
    }
    if(this.speed>0){
        this.speed-=this.friction;
 //decrese speed
   
    }
    if(this.speed<0){
        this.speed+=this.friction; 
//resist movement in opposite of back movement so aincrease speed
    }
    if(Math.abs(this.speed)<this.friction){
        this.speed=0;
//when speed<friction car moves still as speed changing so we added
//this to limit movement in static friction condition ie. when speed<friction
    }

    if(this.controls.left){
        this.angle+=0.03;
    }
    if(this.controls.right){
        this.angle-=0.03;
    }
    if(this.speed!=0){
        const flip=this.speed>0?1:-1; // if forward direction flip sign is same, but -ve in backward direct
        if(this.controls.left){
            this.angle+=0.03*flip;
    //hence in backward direction rt controls rt direction from back side of car
        }
        if(this.controls.left){
            this.angle+=0.03*flip;
//hence in backward direction lt controls lt direction from back side of car

        }
    }

    this.x-=Math.sin(this.angle)*this.speed;
//changes the coordinate such that x and y updates in the rotated direction on change in speed
//hence car moves in the roatated direction
    this.y-=Math.cos(this.angle)*this.speed;
// y increases downwards in pc, so if y decreses it goes up
//if speed inc. , y dec. fast ie. move up fast
}
    draw(ctx,drawSensor=false){//drawSensor by def false only my car get sensor
//     /*    ctx.save();
//         ctx.translate(this.x,this.y);
//         ctx.rotate(-this.angle);*/


//         if(this.damaged){
//             ctx.fillStyle="gray";//car becomes grey if hit border or traffic
//         }
//         else{
//             ctx.fillStyle=color;// car color as passed from main.js
//         }
 
//         ctx.beginPath();
  
//   /*      //This line starts a new path or shape on the canvas. 
//     // It tells the rendering context (ctx) to begin constructing a new shape that will be drawn.
//         ctx.rect(  // drawing a rectangle
//             -this.width/2, 
// //  Dividing by 2 allows the rectangle to be centered horizontally around the car's position.
// //yani 100,100 k agal bagal width/2 width/2
//             -this.height/2,
// //yani 100,100 k upar niche ht/2 ht/2
//             this.width,
//             this.height
//         ); */

//         ctx.moveTo(this.polygon[0].x, this.polygon[0].y); //starting index
//         for(let i=1;i<this.polygon.length;i++){
//             ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
// //goes till all coordinates to make rectangle of car
//         }
//          ctx.fill(); 
//         //  ctx.fill() method fills the shape with the current fill style of the rendering context.
        if(this.sensor&&drawSensor){
            this.sensor.draw(ctx);
            }
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.rotate(-this.angle);
            if(!this.damaged){
                ctx.drawImage(this.mask,
                    -this.width/2,
                    -this.height/2,
                    this.width,
                    this.height);
                ctx.globalCompositeOperation="multiply";
 // When this operation is set, the pixel colors of the source (newly drawn content) and destination (existing content on the canvas) are multiplied together, resulting in a darker blend. This blending mode
//   is often used for creating shading or applying color effects.
                }
            ctx.drawImage(this.img,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.restore();
        
       
    }
}
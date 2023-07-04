const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");


const road=new Road(carCanvas.width/2,carCanvas.width*0.90);
// x coord=width/2 and width is 90% of canvas width
const N=1;
const cars=generateCars(N);
// const car=new Car(road.getLaneCenter(1),100,30,50,"AI");//AI control for this car
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.3);
//    If you use a smaller mutation magnitude, such as 0.1, the 
// mutations will be more subtle. This can be useful when you want 
// to make small adjustments to the neural network's parameters while preserving the learned behavior to a greater extent. 
 
// On the other hand, a larger mutation magnitude, such as 0.2, introduces more significant changes to the neural network's
//  biases and weights. This can help explore a broader range of possibilities and potentially discover better-performing solutions. 
}
        // we applying mutations on other blue cars expect our bestcar cars[0]
        // By applying mutations to the neural networks of cars (except the best car), you allow for the exploration of 
        // different variations and potential improvements in their movement strategies. 
        // moreover whichever is best having y min(ahead) will be taken ie. the car with the lowest y value (closest to the goal or desired position) 
        // is preserved without undergoing mutations
    }
    
    //if for the situation there is a saved brain in local storage then use that
}


const traffic=[ // traffic is array of cars
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),//No Keys control for this car so DUMMY
// given by def 2 as maxspeed of traffic cars ie.< maxspeed of our car to surpass dummy car 
new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(0),-900,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(2),-900,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(1),-1200,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(2),-1200,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(0),-1500,30,50,"DUMMY",2,getRandomColor()),
new Car(road.getLaneCenter(2),-1500,30,50,"DUMMY",2,getRandomColor())





];

animate();//user defined


function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}//save(): This function is used to save the neural
//  network model of the best performing car. It calls
//  localStorage.setItem() to store the bestCar.brain
//  object in the browser's localStorage. The 
// bestCar.brain is first converted to a JSON string 
// using JSON.stringify() to ensure it can be stored 
// as a string in localStorage(as local storage only work with strings). 
// When the car encounters situations similar to the ones it previously learned from, it can load the stored
//  neural network model from localStorage and use it to make decisions.


function discard(){
    localStorage.removeItem("bestBrain");
}
//  This function is useful when you no longer want to keep the saved neural network model and want to clear it from the browser's storage.

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}//for more cars on same lane



function animate(){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);// note: [] empty as we dont allowing dummy cars to sense other dummy cars
        // alowing movement of traffic cars
    }
    for(let i=0;i<cars.length;i++){
    cars[i].update(road.borders,traffic);//to pass the borders to car & from car to sensors
//,traffic allows to car sense traffic as well with borders
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));//ie. switching to the car of all cars produced to the 
        // one moving ahead as(y less-> more up) in pc

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);//road drawn before car
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red"); //drawing traffic cars
    }

    carCtx.globalAlpha=0.2;//tp make the cars transparent
    for(let i=0;i<cars.length;i++){
    cars[i].draw(carCtx,"blue"); 
    }
    carCtx.globalAlpha=1;// to restore transparency to optimal
    bestCar.draw(carCtx,"blue",true);//'true' as only sensors for my car[0]


    carCtx.restore();

    requestAnimationFrame(animate);
//this call animate method many times in a sec to give 
// illusion of movement we want
}


class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5;
        this.rayLength=100;
        this.raySpread=Math.PI/2;
        //angle by which rays spreads
        this.rays=[];//keep the rays created
        this.readings=[];// read borders for rays
    }
    update(roadBorders,traffic){
        this.#castRays();
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic)
            );//fills reading array with ray &respective border
        }
    }

    #getReading(ray,roadBorders,traffic){
        let touches=[];

        for (let i=0;i<roadBorders.length;i++){
            const touch=getIntersection(
            // returns x,y & offset ie. distance b/w the ray & obstruction
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]//these are input to getIntersection
            );
            if(touch){// if obstruction identified
                touches.push(touch); // push returned values
            }
        }

        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){// if obstruction identified
                    touches.push(value); // push returned values
                }
            }
        }

        if(touches.length==0){
            return null; 
        }
        else{
            const offsets=touches.map(e=>e.offset);
        //make array of the returned offset values by all rays 
            const minOffset=Math.min(...offsets);
        //take the most near obstruction offset value and return its coordinate
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(
        // to create evenly distributed rays out of total raycount
        // beatween the rayspread angle
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
                //when raycount is 1 ,single ray is equally divided 50% on either side of angle
                //else if raycount is >1 it is divided uniformly in equal % b/w each rays
            )+this.car.angle;//to change the ray angle along with car angle

            const start={x:this.car.x,y:this.car.y};
    //starting point of ray same as car coordinates
            const end={
                x:this.car.x-
                Math.sin(rayAngle)*this.rayLength,
                //subracting horizontal componet to limit ray end length
                y:this.car.y-
                Math.cos(rayAngle)*this.rayLength 
                //subtracting vertical comp to limit ray end length
            };
            this.rays.push([start,end]);
            //filling the rays array
        }
    }
    draw(ctx){
        for(let  i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
        //note: rays[i] is index representing different rays
        // rays[i][0] is start coordinate of ray and rays[i][1] is end coordinate of ray
            if(this.readings[i]){
                end=this.readings[i];
                //readings[i] has coordinate of nearest obstruction
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            //note x and y changes by linear interpolation
            ctx.moveTo(
                this.rays[i][0].x,//for each ray index i start from car index
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x, //till nearest obstruction(if any) goes yellow ray
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            //note x and y changes by linear interpolation
            ctx.moveTo(
                this.rays[i][1].x,//for each ray index i , black line start from ray end point
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x, // ray black line comes till the nearest obstruction(if any)
                end.y
            );
            ctx.stroke();
        }
    }
}

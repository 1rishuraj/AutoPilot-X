function lerp(A,B,t){
    return A+(B-A)*t;
     //allows to move A towards B percentage wise (slowly instead of suddenly)
     //when lanes=0 then x=left coordinate;
     //when lanes=3 then x=right coordinate
     ////when lanes=0to3 any value then x=b/w lt and rt coordinate;
}
function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}
/*the getIntersection() function takes four points representing two
 line segments and determines whether they intersect. If an 
 intersection is found, the function returns the coordinates of 
 the intersection point. Otherwise, it returns null*/

function polysIntersect(poly1,poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                    poly1[i],
                    poly1[(i+1)%poly1.length],
                    // % allows to make it 0 index hence last coordinate connects to
                    // first coordinate in polygon ie. 1-2-3-4 & 4th coord to again 1st coord
                    poly2[j],
                    poly2[(j+1)%poly2.length],
//comparing poly1 to corresponding poly2 coordinate if they intersect
//each other

            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRandomColor(){
    const hue=290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";//100 saturation and 60 lightness
}
      
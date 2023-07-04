class NeuralNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]// taking i/p into levels
            ));
        }
    }

    static feedForward(givenInputs,network){//givenInput is the offset read by 
        // respective obstruction detecting rays(rays considerd as inner 1st layer nodes)
        //  & network is the levels
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]);
// The output from each level becomes the input for the next
//  remaining level. 
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }
    // The final outputs of the last level are returned as
//  the result of the feedforward pass to tell what to do

static mutate(network,amount=1){
    // the mutate() method is a mechanism to explore different cases of 
// car movement by introducing random mutations to the neural network's biases and weights, 
// enabling the car to adapt and potentially improve its performance over time.
    network.levels.forEach(level => {
        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=lerp(
                level.biases[i],
                Math.random()*2-1,
                amount
            )
            // The amount parameter controls the magnitude of the mutations,
            //  with larger values resulting in more significant changes to the network's parameters.
        }
        for(let i=0;i<level.weights.length;i++){
            for(let j=0;j<level.weights[i].length;j++){
                level.weights[i][j]=lerp(
                    level.weights[i][j],
                    Math.random()*2-1,
                    amount
                )
            }
        }
    });
}

}



class Level{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        // these input are the values we get from car sensors
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);
//each o/p neuron has a bias , the value above which it fires other forwrd neuron
        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
    //for each input node we have outputneuron count connections of some weight
        }
// meanwhile to fill some values in weights and bias to function we randomise
        Level.#randomize(this);
// The Level class has a private static method #randomize(level)

    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;
// for each input node, giving some wt value (-1 or 1) for all 
// its connections to upper layer node  
// explaination of -1 & 1 in Documentation
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
            // bias value is also -1 or 1
        }
//  that assigns random values between -1 and 1 to the weights 
// and biases of the level.
    }

    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];// input of offset from rays
        }

        for(let i=0;i<level.outputs.length;i++){
    //we calculate each o/p via i/p with the help of sum
            let sum=0
         
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            // sum is adding all the  products b/w the each input & wt of each o/p   
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            } 
        }
    // If the sum exceeds the bias, the output of the neuron is 
    // set to 1; otherwise, it is set to 0.
        return level.outputs;
    }
}
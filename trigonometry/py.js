function Pytag(a,b,c){
    if(a == "a"){
        var ans = Math.pow((Math.pow(c,2)-Math.pow(b,2)),0.5)
        console.log(ans)
        //DisplayMath(ans)
    }if(b == "b"){
        var ans = Math.pow((Math.pow(c,2)-Math.pow(a,2)),0.5)
        console.log(ans)
        //DisplayMath(ans)
    }if(c == "c"){
        var ans = Math.pow((Math.pow(a,2)+Math.pow(b,2)),0.5)
        console.log(ans)
        //DisplayMath(ans)
    }
}

function sin(v){
    var ans =  Math.sin(toDegress(v))
    //DisplayMath("sin(" + v + ")" + "=" + ans)
    console.log(ans)
    return ans
}

function cos(v){
    var ans =  Math.cos(toDegress(v))
    //DisplayMath("cos(" + v + ")" + "=" + ans)
    console.log(ans)
    return ans
}

function tan(v){
    var ans =  Math.tan(toDegress(v))
    //DisplayMath("tan(" + v + ")" + "=" + ans)
    console.log(ans)
    return ans
}

function asin(v){
    var ans = RtD(Math.asin(v))
    console.log(ans)
    return ans
}

function acos(v){
    var ans = RtD(Math.acos(v))
    console.log(ans)
    return ans
}

function atan(v){
    var ans = RtD(Math.atan(v))
    console.log(ans)
    return ans
}



function toDegress(deg){
    var ans = deg * (Math.PI/180)
    return ans
}

function RtD(r){
    var ans = r * (180/Math.PI)
    return ans
}

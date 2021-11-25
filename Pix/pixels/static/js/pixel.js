var img = document.getElementById('original');
img.crossOrigin = "Anonymous";
var canvas = document.getElementById('canvas');
var ctxt = canvas.getContext('2d');

img.onload = function() {
	ctxt.drawImage(img, 0, 0, canvas.width, canvas.height);
};

var original = function() { // black and white image
	ctxt.drawImage(img, 0, 0, canvas.width, canvas.height);;
};

function randomizedResponse(trueval, alpha, beta){
    if (Math.random() < alpha){
        return trueval;
    } else if (Math.random() < beta){
        return 1;
    } else {
        return 0;
    }
}

function difimage(the_ctxt, the_canvas, the_img, the_alpha, the_beta) {
	the_ctxt.drawImage(the_img, 0, 0, the_canvas.width, the_canvas.height);
	const imageData = the_ctxt.getImageData(0, 0, the_canvas.width, the_canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
        let t = -1;
        t = randomizedResponse(-1, the_alpha, the_beta);
        if (t == 1) { // replace with black pixel
            data[i] = 0;      // r
            data[i + 1] = 0;  // g
            data[i + 2] = 0;  // b
        } else if (t == 0){ // replace with white pixel
            data[i] = 255;        // r
            data[i + 1] = 255;    // g
            data[i + 2] = 255;    // b
        } else { // keep original black or white pixel
        }
	}
	the_ctxt.putImageData(imageData, 0, 0);
}

const xs = document.getElementById("ExSample");

const inputs = document.querySelectorAll('[name=choice]');
for (const input of inputs) {
	input.addEventListener("change", function(evt) {
		switch (evt.target.value) {
			case "coindif":
                xs.innerText = "";
				return difimage(ctxt, canvas, img, 0.5, 0.5);
            case "sample":
                let ss = document.getElementById("SampleSize").value;
                makeSample(ctxt, ss);
                let the_data = ctxt.getImageData(0, 0, canvas.width, canvas.height).data;
                let x = countSpecial(the_data)  
                xs.innerText = `${x} of the ${ss} pixel sample were black`;
                return 0;
			default:
                xs.innerText = "";
				return original();
		}
	});
}

function isBlack(r,g,b) {
   return (r + g + b)/3 < 100; // probably
}
function findProp(the_data) {
    var count = 0;
    var not = 0;
	for (var i = 0; i < the_data.length; i += 4) {
        let r = the_data[i];
        let g = the_data[i + 1];
        let b = the_data[i + 2];
        if (isBlack(r,g,b)){
            count += 1;
        } else {
            not += 1;
        }
	}
    return count / (count + not);
}

const b = document.getElementById("Proportion");
const p = document.getElementById("ProportionData");
b.addEventListener("click", ()=>{
    let the_data = ctxt.getImageData(0, 0, canvas.width, canvas.height).data;
    let val = findProp(the_data);
    p.innerHTML = `${(val * 100).toPrecision(4)}% of the pixels are black`;
});

function proptestmsg(alpha, beta, val1, val2) {
    let out = "";
    out = out + `<br> ${(val1 * 100).toPrecision(4)}% of the original pixels are black`;
    out = out + `<br> ${(val2 * 100).toPrecision(4)}% of the dif pixels are black`;
    out = out + `<br> alpha = ${alpha}, beta = ${beta}`
    let val3 = (1 - alpha) * beta;
    out = out + `<br> ${(val3 * 100).toPrecision(4)}% of the dif black pixels should be random`;
    out = out + "<br> original proportion = <br> (dif proportion - dif random proportion)/alpha"
    let val4 = (val2 - val3) / alpha;
    out = out + `<br> calculating original from dif: ${(val4 * 100).toPrecision(4)}%`;
    return out;
}
const bt = document.getElementById("ProportionTest");
const pt = document.getElementById("ProportionTestData");
bt.addEventListener("click", ()=>{
    original();
    let val1 = findProp(ctxt.getImageData(0, 0, canvas.width, canvas.height).data);
    difimage(ctxt, canvas, img, 0.5, 0.5);
    let val2 = findProp(ctxt.getImageData(0, 0, canvas.width, canvas.height).data);
    pt.innerHTML = proptestmsg(0.5, 0.5, val1, val2);
});

function filtering(list, val) {
    let out = false;
    for (const it of list) {
        if (it == val) {
            out = true;
        }
    }
    return out;
}
function makeSample(the_ctxt, the_size) {
	const imageData = the_ctxt.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
    let samplePixel = [];
    let len = data.length/4;
    for (let i = 0; i < the_size; i++) {
        let added = false;
        do {
            let p = 4*Math.floor(Math.random() * len);
            if (!(p in samplePixel)) {
                samplePixel.push(p);
                added = true;
            }
        } while (!added);
    }
	for (var i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        let x = filtering(samplePixel, i);
        if (x && isBlack(r,g,b)) { // replace with green pixel
            data[i] = 0;            // r
            data[i + 1] = 255;      // g
            data[i + 2] = 255;      // b
        } else if (x){ // replace with red pixel
            data[i] = 255;          // r
            data[i + 1] = 0;        // g
            data[i + 2] = 0;        // b
        } else { // keep original black or white pixel
        }
    }
    the_ctxt.putImageData(imageData, 0, 0);
}

function isGreen(r,g,b) {
    let test = (r + g + b)/3;
    return test == 170; // probably
}
function countSpecial(the_data) {
    var count = 0;
    for (var i = 0; i < the_data.length; i += 4) {
        let r = the_data[i];
        let g = the_data[i + 1];
        let b = the_data[i + 2];
        if (isGreen(r,g,b)){
            count += 1;
        }
    }
    return count;
}

function proptestmsg2(alpha, beta, val1, val2, sampleSize, x) {
    let out = "";
    out = out + `<br> ${(val1 * 100).toPrecision(4)}% of the original pixels are black`;
    out = out + `<br> ${(val2 * 100).toPrecision(4)}% of the dif pixels are black`;
    out = out + `<br> ${x} of the ${sampleSize} pixel sample were black`;
    let xval = x / sampleSize;
    out = out + `<br> ${(xval * 100).toPrecision(4)}% of the dif pixels are estimated to be black`;
    out = out + `<br> alpha = ${alpha}, beta = ${beta}`
    let val3 = (1 - alpha) * beta;
    out = out + `<br> ${(val3 * 100).toPrecision(4)}% of the dif black pixels should be random`;
    out = out + "<br> estimated original proportion = (estimated dif proportion - dif random proportion)/alpha"
    let val4 = (xval - val3) / alpha;
    out = out + `<br> calculating estimated original from dif: ${(val4 * 100).toPrecision(4)}%`;
    return out;
}
const bst = document.getElementById("ProportionSampleTest");
const pst = document.getElementById("ProportionSampleTestData");
bst.addEventListener("click", ()=>{
    original();
    let the_data1 = ctxt.getImageData(0, 0, canvas.width, canvas.height).data;
    let val1 = findProp(the_data1);
    difimage(ctxt, canvas, img, 0.5, 0.5);
    let the_data2 = ctxt.getImageData(0, 0, canvas.width, canvas.height).data;
    let val2 = findProp(the_data2);
    let sampleSize = document.getElementById("SampleSize").value;
    makeSample(ctxt, sampleSize);
    let the_data = ctxt.getImageData(0, 0, canvas.width, canvas.height).data;
    let x = countSpecial(the_data) 
    pst.innerHTML = proptestmsg2(0.5, 0.5, val1, val2, sampleSize, x);
});


const button = document.getElementById("Generate");
var table = document.getElementById("GenerateTable"); 
button.addEventListener("click", ()=>{
    table.innerHTML = "";
    
    original();
    let val1 = findProp(ctxt.getImageData(0, 0, canvas.width, canvas.height).data);

    for (let i = 0; i <= 10; i++) {
        let alphapercent = i * 10;
        let alpha = alphapercent / 100;
        let beta = 0.5;

        let newRow = table.insertRow(-1);

        let newCell1 = newRow.insertCell(0);
        let c = alpha + (1-alpha)*beta;
        let difval = Math.log(c/(1-c));
        let newText2 = document.createTextNode(``);
        newCell1.innerHTML = `${alphapercent}%, 50% <br> ε = ${difval.toPrecision(4)}`;

        let newCell2 = newRow.insertCell(1);
        var newCanvas = document.createElement("CANVAS");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        var newCtxt = newCanvas.getContext('2d'); 
        difimage(newCtxt, newCanvas, img, alpha, beta);
        newCell2.appendChild(newCanvas);
        
        let newCell3 = newRow.insertCell(2);
        let val2 = findProp(newCtxt.getImageData(0, 0, canvas.width, canvas.height).data);
        let msg = proptestmsg(alpha, beta, val1, val2); 
        newCell3.innerHTML = msg;

        let newCell4 = newRow.insertCell(3);
        let sampleSize = document.getElementById("SampleSize").value;
        makeSample(newCtxt,sampleSize);
        let the_data = newCtxt.getImageData(0, 0, canvas.width, canvas.height).data;
        let x = countSpecial(the_data) 
        let msg2 =  proptestmsg2(alpha, beta, val1, val2, sampleSize, x);
        newCell4.innerHTML = msg2;
    }
    alert("done");
});

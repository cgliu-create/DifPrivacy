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
        return 0;
    } else {
        return 1;
    }
}

var difimage = function(the_ctxt, the_canvas, the_img, the_alpha, the_beta) {
	the_ctxt.drawImage(the_img, 0, 0, the_canvas.width, the_canvas.height);
	const imageData = the_ctxt.getImageData(0, 0, the_canvas.width, the_canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
        let t = -1;
        t = randomizedResponse(-1, the_alpha, the_beta);
        if (t == 0) { // replace with white pixel
            data[i] = 255;      // r
            data[i + 1] = 255;  // g
            data[i + 2] = 255;  // b
        } else if (t == 1){ // replace with black pixel
            data[i] = 0;        // r
            data[i + 1] = 0;    // g
            data[i + 2] = 0;    // b
        } else { // keep original black or white pixel
        }
	}
	the_ctxt.putImageData(imageData, 0, 0);
}


const inputs = document.querySelectorAll('[name=color]');
for (const input of inputs) {
	input.addEventListener("change", function(evt) {
		switch (evt.target.value) {
			case "coindif":
				return difimage(ctxt, canvas, img, 0.5, 0.5);
			default:
				return original();
		}
	});
}
const button = document.getElementById("Generate");
var table = document.getElementById("GenerateTable"); 
button.addEventListener("click", ()=>{
    table.innerHTML = "";
    for (let i = 0; i <= 10; i++) {
        let alphapercent = i * 10;
        let alpha = alphapercent / 100;

        let newRow = table.insertRow(-1);
        let newCell1 = newRow.insertCell(0);
        let newText = document.createTextNode(`${alphapercent}%, 50%`);
        newCell1.appendChild(newText);

        let newCell2 = newRow.insertCell(1);
        var newCanvas = document.createElement("CANVAS");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        var newCtxt = newCanvas.getContext('2d'); 
        difimage(newCtxt, newCanvas, img, alpha, 0.5);
        newCell2.appendChild(newCanvas); 

    }
})

# DifPrivacy
## Pix - Basic Differential Privacy

Pix is a simple Django website that visualizes some basic differential privacy. The website shows an image composed of black and white pixels. It depicts the trade-off of accuracy and privacy as you increase the noise.

In the Coin Differential, you flip a coin once. If the coin is Heads, then you use the correct black or white pixel. If the coin is Tails, then you flip a second coin. If the second coin is Heads, replace the original pixel with a black pixel. If the second coin is Tails, replace the original pixel with a white pixel.  

For the Coin Differential, alpha = 0.50 and beta = 0.50.
```javascript
function randomizedResponse(trueval, alpha, beta){
   if (Math.random() < alpha){
      return trueval;
   } else if (Math.random() < beta){
      return 1;
   } else {
      return 0;
   }
}
```

```
// pseudo code for image manipulations
for each pixel (r,g,b) in ImageData do
   testVal ← -1
   testVal ← randomizedResponse(testVal, alpha, beta) 
   if testVal equals 1 do
      (r,g,b) ← (0,0,0)       // replace with black pixel
   else if testVal equals 0 do
      (r,g,b) ← (255,255,255) // replace with white pixel
   else
      // -1, keep original black or white pixel
```

<img width="294" alt="1" src="https://user-images.githubusercontent.com/59263349/143334339-c7d7bbd6-8f13-4862-ae1d-19e214e9bbb1.png">

Here, **proportion of black pixels in the modified image = alpha * proportion of black pixels in the original image + (1 - alpha) * beta**.

where **alpha * proportion of black pixels in the original image** is the proportion of black pixels that are from the original image

where **(1 - alpha) * beta** is the proportion of black pixels that are random

<img width="295" alt="2" src="https://user-images.githubusercontent.com/59263349/143334601-bbffe4d3-01f5-4f35-97a5-44460ebea786.png">

Therefore, **proportion of black pixels in the original image = (proportion of black pixels in the modified image - proportion of black pixels that are random)/alpha**

<img width="245" alt="3" src="https://user-images.githubusercontent.com/59263349/143334624-27342f39-d452-48cb-9520-d170682b3a4c.png">

This proportion could be estimated by taking a sample of the pixels. If the black and white pixels represented "yes" and "no" in a survey, we would be estimating a response proportion while obfuscating the responses for privacy.


### Installation

```bash
git clone <this repository>
```

### Usage

```bash
cd Pix
python3 manage.py runserver   
```

# DifPrivacy
## Pix - Basic Differential Privacy

<p float="left">
  <img width="287" alt="01" src="https://user-images.githubusercontent.com/59263349/143482682-4b2190e2-c88e-4c0b-966a-f4013e2818c1.png">
  <img width="287" alt="02" src="https://user-images.githubusercontent.com/59263349/143482689-3ee83f48-07ca-4a0b-b44e-39555fbb6ac2.png">
  <img width="289" alt="03" src="https://user-images.githubusercontent.com/59263349/143482704-a975070e-8d4f-43f7-89d7-2e1ae3a982f6.png">

</p>  


Pix is a simple Django website that visualizes some basic differential privacy. The website shows an image composed of black and white pixels. It depicts the trade-off of accuracy and privacy as you increase the noise.


<img width="685" alt="04" src="https://user-images.githubusercontent.com/59263349/143482733-b59d2f1d-91b8-4015-88b3-609482ee9557.png">


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

Since 1 = black pixel and 0 = white pixel, the difference between any two pixels values is <= 1.
This fulfills the condition for the differential privacy formula:

<img width="398" alt="4" src="https://user-images.githubusercontent.com/59263349/143376067-951edca1-7232-45a4-9720-056d8bb1821b.png">


Where M is the randomized response mechanism 

S is the set of possible outputs from M

x is from dataset n

y is from dataset n-1 (without x)

ε is the privacy parameter

<img width="287" alt="5" src="https://user-images.githubusercontent.com/59263349/143376105-68843a9d-b170-4775-ae93-004c9211ce74.png">


Finding ε:

the probability of the randomized response is correctly 1 / 
the probability of the randomized response is a randomized 1 = e^ε

<img width="293" alt="6" src="https://user-images.githubusercontent.com/59263349/143376165-baed380a-d954-4935-ab47-04989fccad51.png">


For alpha = 0.50 and beta = 0.50, ε = ln(3)


### Installation

```bash
git clone <this repository>
```

### Usage

```bash
cd Pix
python3 manage.py runserver   
```

check out https://robertovitillo.com/differential-privacy-for-dummies/ for more

# DifPrivacy

Differential privacy: a system for extracting meaningful information from a dataset while withholding information about individuals in the dataset. It works by adding statistical noise to the data (either to their inputs-locally or the output-globally).

## NoisyAverage.py - Basic Differential Privacy

Suppose we want to know the average amount of money an individual has in their pocket.
However, people are uncomfortable with sharing the exact number they have.
Therefore, we ask the individuals to add a random number (-100 to 100) to the amount that they hold and give us the result.
This adds noise/randomness to responses, hiding the exact personal information of individuals.
Now, using the law of large numbers, if we have a sufficiently large sample size, the noise cancels out and we can find the true population average. 

<img width="600" alt="x" src="https://user-images.githubusercontent.com/59263349/144721929-7452768a-73cf-425e-aeb7-6bd3a57ca6d9.png">


## Pix - Local Differential Privacy

Noise is added to individual data points, represented by pixels.

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

The differential privacy formula means that if the data of one individual is removed, the probability of the output with the dataset is close to the probability of the same output with the dataset that still has the individual. This allows us to extract meaningful information from the datasets without needing to know the exact information of an individual.

<img width="287" alt="5" src="https://user-images.githubusercontent.com/59263349/143376105-68843a9d-b170-4775-ae93-004c9211ce74.png">


Finding ε:

the probability of the randomized response is correctly 1 / 
the probability of the randomized response is a randomized 1 = e^ε

<img width="293" alt="6" src="https://user-images.githubusercontent.com/59263349/143376165-baed380a-d954-4935-ab47-04989fccad51.png">


For alpha = 0.50 and beta = 0.50, ε = ln(3)

A smaller ε will yield better privacy but a less accurate response. ε becomes smaller as alpha, the proportion of data that is not randomized, decreases. As ε becomes smaller, exp(ε) or e^ε gets closer to 1. The probability of the output with the dataset without an individual is same as the probability of the same output with the dataset that still has the individual because both datasets are now completely randomized and meaningless.

### Installation

```bash
git clone <this repository>
```

### Usage

```bash
cd Pix
python3 manage.py runserver   
```

## Laplace.py - Global Differential Privacy
Suppose we want to know the average proportion of some behavior.
But, for some reason we don't want to tell the true average to some third party.
Therefore, we decide to add a randomized error amount with a known distribution.
This allows us hide the exact number while also allowing the other party to know that 
it is in a certain range with a level of confidence.

* Note we like working with values between 0 and 1

<img width="455" alt="l" src="https://user-images.githubusercontent.com/59263349/144878229-02a0ccc5-62d0-4456-b0ff-0f678ed712e5.png">


https://robertovitillo.com/differential-privacy-for-dummies/

https://becominghuman.ai/what-is-differential-privacy-1fd7bf507049

https://www.seas.upenn.edu/~cis399/files/lecture/l21.pdf

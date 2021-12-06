# DifPrivacy

Differential privacy: a system for extracting meaningful information from a dataset while withholding information about individuals in the dataset. It works by adding statistical noise to the data (either to their inputs-locally or the output-globally).

## NoisyAverage.py - Basic Differential Privacy

Suppose we want to know the average amount of money an individual has in their pocket.
However, people are uncomfortable with sharing the exact number they have.
Therefore, we ask the individuals to add a random number (-100 to 100) to the amount that they hold and give us the result.
This adds noise/randomness to responses, hiding the exact personal information of individuals.
Now, using the law of large numbers, if we have a sufficiently large sample size, the noise cancels out and we can find the true population average. 

<img width="600" alt="x" src="https://user-images.githubusercontent.com/59263349/144721929-7452768a-73cf-425e-aeb7-6bd3a57ca6d9.png">

### Installation

```bash
git clone <this repository>
```

### Usage

```bash
cd <this repository>
python3 NoisyAverage.py
```

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
cd <this repository>/Pix
python3 manage.py runserver   
```

## Laplace.py - Global Differential Privacy
Suppose we want to know the average proportion of some behavior.
But, for some reason we don't want to tell the true average to some third party.
Therefore, we decide to add a randomized error amount with a known distribution.
This allows us hide the exact number while also allowing the other party to know that 
it is in a certain range with a level of confidence.

* Note we like working with values between 0 and 1, it is necessary for our differential privacy formula

<img width="551" alt="o" src="https://user-images.githubusercontent.com/59263349/144889976-ea6f52ac-2097-4ff8-abc8-a7fcd842de38.png">

<img width="585" alt="dst" src="https://user-images.githubusercontent.com/59263349/144890004-a2730262-44e1-4ae2-b96e-b0c78c4bf7e2.png">

<img width="322" alt="l1" src="https://user-images.githubusercontent.com/59263349/144902254-1ae30e80-bc2d-4c78-a004-ad297e276f60.png">
Here is the probability density function of a Laplace Distribution. 

Where v is the randomized error amount

b is the scale coef for how wide/steep the distribution is

∆f is the sensitivity of the query (ex: average) that we are doing on the dataset i.e. what is the max change from removing one individual?

ε is the privacy parameter

For the laplace distribution, the expected error amount, E(v) = 0 and the variance Var(v) = 2 * b ^2

Decreasing ε, increases b, increasing the variance, making the dist wider and less steep. Therefore, a smaller ε will yield better privacy but a less accurate response.

<img width="502" alt="l2" src="https://user-images.githubusercontent.com/59263349/144904739-57dfbe41-5e0c-47d6-9d2e-2ce67bdcb096.png">

The Laplace Mechanism adds some randomized error v to some query f on some dataset

<img width="666" alt="l3" src="https://user-images.githubusercontent.com/59263349/144905102-70d59021-ff4e-4759-8b84-cc625bad6dbe.png">

The sensitivity depends on the query operation. For average, the max ∆f = 1/n

Analyzing average: (∑ without X individual + X individual) / n  - (∑ without X individual) / (n-1)

Given an X individual is between 0 and 1, ∑X individuals is between 0 and ∞. 

Looking at the extremes:

(0 + 0)/n - 0/(n-1) = 0, (0 + 1)/n - 0/(n-1) = 1/n, (∞ + 0)/n - ∞/(n-1) = 0, (∞ + 1)/n - ∞/(n-1) = 0

Therefore, the max ∆f = 1/n

<img width="502" alt="l4" src="https://user-images.githubusercontent.com/59263349/144906909-66263045-28d2-4cdd-a20d-5dff69b6f168.png">

<img width="693" alt="l5" src="https://user-images.githubusercontent.com/59263349/144906939-332d6fde-ae0f-4453-97d2-d5c34b585625.png">

The differential privacy formula means that if the data of one individual is removed, the probability of the output with the dataset is close to the probability of the same output with the dataset that still has the individual. In this situation, we can find the probability of a specific output, o from the laplace mechanism given that the center of the distribution is the query from the dataset with an individual or the query from the dataset wihout the an individual. 

This allows us to extract meaningful information from the datasets without needing to know the exact information individuals.

### Installation

```bash
git clone <this repository>
```

### Usage

```bash
cd <this repository>
python3 Laplace.py
```
<hr>

https://robertovitillo.com/differential-privacy-for-dummies/

https://becominghuman.ai/what-is-differential-privacy-1fd7bf507049

https://www.seas.upenn.edu/~cis399/files/lecture/l21.pdf

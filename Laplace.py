import math
import random
import numpy as np
import matplotlib.pyplot as plt

"""
Suppose we want to know the average proportion of some behavior.
But, for some reason we don't want to tell the true average to some third party.
Therefore, we decide to add a randomized error amount with a known distribution.
This allows us hide the exact number while also allowing the other party to know that 
it is in a certain range with a level of confidence.

We like to work with values between 0 and 1.
"""


def randomProportion():
    return random.random()


n = input("Enter n, the size of the sample: \n")

nums = []
for i in range(int(n)):
    x = randomProportion()
    nums.append(x)
    print(f"Individual {i+1} has {x}")

trueavg = sum(nums) / len(nums)
print(f"The true average proportion is {trueavg}")

"""
Determining Sensitivity
∆f = Max d,d'|f(d)−f(d')| over all neighboring databases d and d’
Since we are taking the average of a dataset, what is the max change from removing one individual?
∆f = 1/n

x is between 0 and 1, ∑x is between 0 and ∞. 
Looking at the extremes:
(0 + 0)/n - 0/(n-1) = 0
(0 + 1)/n - 0/(n-1) = 1/n
(∞ + 0)/n - ∞/(n-1) = 0
(∞ + 1)/n - ∞/(n-1) = 0
"""

"""
Laplace mechanism
F(d) = f(d) + Lap(b)
f(d) is the true value of some function of a dataset, ex: average
Lap(b) is randomized error amount with a Laplace distribution
Laplace has a probability density function of y = 1 / 2b * exp( - |x| / b)
b = ∆f / ε, scale coef = sensitivity / privacy parameter
E(x) = 0, expected error amount
Var(x) = 2 * b ^2, variance of error dist

Decreasing ε, increases b, increasing the variance, making the dist wider and less steep
A smaller ε will yield better privacy but a less accurate response.
"""
b = (1/len(nums)) / 1
noisyavg = trueavg + np.random.default_rng().laplace(0, b)
print(f"Laplace RV for noise: center=0, scale={b}")
print(f"Noisy average: {noisyavg}")

dif = noisyavg -  trueavg
print(f"Error amount: {dif}")

variance = 2 * math.pow(b, 2)
stdev = math.sqrt(variance)

print(f"variance: {variance}")
print(f"stdev: {stdev}")
if (noisyavg - stdev) < trueavg < (noisyavg + stdev):
    print("true average is within 1 stdev from noisy average")
elif (noisyavg - 2*stdev) < trueavg < (noisyavg + 2*stdev):
    print("true average is within 2 stdev from noisy average")
elif (noisyavg - 3*stdev) < trueavg < (noisyavg + 3*stdev):
    print("true average is within 3 stdev from noisy average")
else:
    print("true average is not within 3 stdev from noisy average")

"""
Differential Privacy with Laplace
The differential privacy formula means that if the data of one individual is removed, the probability of the output with the dataset is close to the probability of the same output with the dataset that still has the individual. 

Probability of a specific output, o: 
= 1 / 2b * exp( - | f(d) - o | / b), with expected value of dataset d 
= 1 / 2b * exp( - | f(d') - o | / b), with expected value of dataset d' (with one individual removed)
dividing these two expressions: 
= exp( |f(d) − f(d')| / b )
|f(d) − f(d')|  = ∆f 
b = ∆f / ε
so exp( |f(d) − f(d')| / b ) = exp(ε) 
The ratio of the two probabilities ≤ exp(ε) which fulfills the conditions for ε-Differential Privacy
"""

# Create the vectors X and Y
def lap(x):
    return 1 / (2 * b) * math.exp( - abs(x) / b)

x = np.array(np.arange(-0.1, 0.1, 0.0001))
vector = np.vectorize(lap)
y = vector(x)

def errlap(x):
    return 1 / (2 * b) * math.exp( - abs(x - dif) / b)

xe = np.array(np.arange(dif-0.1, dif+0.1, 0.0001))
evector = np.vectorize(errlap)
ye = evector(xe)

# Create the plot
plt.plot(x,y)
plt.plot(xe,ye)
plt.legend(["From error 0", "From noise error"])

# Add a title
plt.title('The Laplace Dist')

# Add X and y Label
plt.xlabel('x axis - error amount')
plt.ylabel('y axis - prob density')

# Show the plot
plt.show()
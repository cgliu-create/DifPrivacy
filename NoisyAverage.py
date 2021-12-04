import random 
"""
Suppose we want to know the average amount of money an individual has in their pocket.
However, people are uncomfortable with sharing the exact number they have.
Therefore, we ask the individuals to add a random number (-100 to 100) to the amount that they hold and give us the result.
This adds noise/randomness to responses, hiding the exact personal information of individuals.
Now, using the law of large numbers, if we have a sufficiently large sample size, the noise cancels out and we can find the true population average. 
"""
def randomCashAmount():
    return random.randint(0, 1000)

def randomNumber():
    return random.randint(-100, 100)

n = input("Enter n, the size of the sample: \n")

cash = []
noisecash = []
for i in range(int(n)):
    x = randomCashAmount();
    y = randomNumber()
    z = x + y;
    cash.append(x)
    noisecash.append(z)
    print(f"Individual {i+1} has ${x}, told us {z}")

trueavg = sum(cash) / len(cash)
noiseavg = sum(noisecash) / len(noisecash)

print(f"The true average is ${trueavg}")
print(f"With the noisy data, we got ${noiseavg}")
print("With a large n, these two values should be very close.")
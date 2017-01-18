import numpy as np
from scipy.stats import pareto
import matplotlib.pyplot as plt
fig, ax = plt.subplots(1, 1)

a, m = 20., 2.  # shape and mode
s = (np.random.pareto(a, 100) + 1) * m

count, bins = np.histogram(s, 100, normed=True)
fit = a*m**a / bins**(a+1)
# print bins

samples = fit / np.max(fit)
samples = np.round(samples*50)
print samples

plt.plot(bins, samples)

plt.show()

import numpy as np
from scipy.stats import pareto
import matplotlib.pyplot as plt
fig, ax = plt.subplots(1, 1)

b = 2.62

x = np.linspace(pareto.ppf(0.01, b), pareto.ppf(0.99, b), 100)
ax.plot(x, pareto.pdf(x, b), 'r-', lw=5, alpha=0.6, label='pareto pdf')

r = pareto.rvs(b, size=1000)
print r
ax.hist(r, normed=True, histtype='stepfilled', alpha=0.2)
ax.legend(loc='best', frameon=False)

plt.show()

# a, m = 50., 100.  # shape and mode
# s = (np.random.pareto(a, 1000) + 1) * m
#
# import matplotlib.pyplot as plt
# count, bins, _ = plt.hist(s, 100, normed=True)
# print bins
# fit = a*m**a / bins**(a+1)
# print fit
# plt.plot(bins, max(count)*fit/max(fit), linewidth=2, color='r')
# plt.show()

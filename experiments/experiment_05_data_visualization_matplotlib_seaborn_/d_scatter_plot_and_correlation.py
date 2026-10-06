# 5d. Scatter plot and correlation
import pandas as pd, matplotlib.pyplot as plt
df=pd.DataFrame({'Study_Hours':range(1,11),
  'Marks':[45,50,55,60,65,70,72,80,85,90]})
plt.scatter(df['Study_Hours'],df['Marks'])
plt.xlabel("Study Hours"); plt.ylabel("Marks"); plt.grid(True); plt.show()
print("Correlation Coefficient:",round(df['Study_Hours'].corr(df['Marks']),2))

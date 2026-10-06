# 5c. Histogram and density plot
import pandas as pd, seaborn as sns, matplotlib.pyplot as plt
data=[45,50,52,55,58,60,62,65,68,70,72,75,78,80,82,85,88,90,92,95]
df=pd.DataFrame({'Marks':data})
sns.histplot(df['Marks'],bins=6,kde=False); plt.show()
sns.kdeplot(df['Marks'],fill=True); plt.show()

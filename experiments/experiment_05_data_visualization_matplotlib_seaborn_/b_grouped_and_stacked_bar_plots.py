# 5b. Grouped and stacked bar plots
import pandas as pd, matplotlib.pyplot as plt
df=pd.DataFrame({'Python':[85,90,78,88],'Java':[75,82,80,85],'C++':[80,76,85,90]},
  index=['Student1','Student2','Student3','Student4'])
print(df)
df.plot(kind='bar'); plt.title("Grouped"); plt.show()
df.plot(kind='bar',stacked=True); plt.title("Stacked"); plt.show()

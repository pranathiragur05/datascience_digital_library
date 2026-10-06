# 4b. Rearranging data with stack and unstack
import pandas as pd
index=pd.MultiIndex.from_tuples([('Engineering','CSE'),('Engineering','ECE'),('Science','Physics'),('Science','Chemistry')],names=['Department','Branch'])
data=pd.DataFrame({'2025':[85,78,92,88],'2026':[90,82,95,91]},index=index)
print(data)
u=data.unstack()
print(u)
print(u.stack())

# 4a. Hierarchical indexing and partial indexing
import pandas as pd
index=[['Engineering','Engineering','Science','Science'],['CSE','ECE','Physics','Chemistry']]
mi=pd.MultiIndex.from_arrays(index,names=['Department','Branch'])
marks=pd.Series([85,78,92,88],index=mi)
print(marks)
print(marks.loc['Engineering'])
print(marks.loc[('Engineering','CSE')])
print(marks.loc['Science'])

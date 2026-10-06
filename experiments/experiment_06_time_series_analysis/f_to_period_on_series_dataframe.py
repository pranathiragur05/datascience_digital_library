# 6f. to_period on Series / DataFrame
import pandas as pd
dates=pd.to_datetime(['2026-01-10','2026-02-15','2026-03-20','2026-04-25'])
sales=pd.Series([1000,1500,1800,2200],index=dates)
print(sales.to_period('M'))

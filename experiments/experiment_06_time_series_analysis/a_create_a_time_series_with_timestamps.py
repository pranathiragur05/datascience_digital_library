# 6a. Create a time series with timestamps
import pandas as pd
dates=pd.to_datetime(['2026-01-01','2026-01-02','2026-01-03','2026-01-04','2026-01-05'])
ts=pd.Series([28,30,29,31,32],index=dates)
print(ts)

# 6g. Resampling, downsampling, upsampling
import pandas as pd
idx=pd.date_range('2026-01-01',periods=12,freq='h')
ts=pd.Series([10,12,15,14,18,20,22,21,25,28,30,32],index=idx)
print(ts.resample('3h').mean())
print(ts.resample('4h').sum())
print(ts.resample('30min').ffill().head(6))

# 6c. Time zones: localize, convert, combine
import pandas as pd
d=pd.date_range('2026-01-01 09:00',periods=3,freq='h')
ind=d.tz_localize('Asia/Kolkata')
ny=ind.tz_convert('America/New_York')
s1=pd.Series([100,200,300],index=ind)
s2=pd.Series([400,500,600],index=ny)
print(ny)
print(pd.concat([s1,s2]))

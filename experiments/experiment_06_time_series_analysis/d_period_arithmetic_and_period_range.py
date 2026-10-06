# 6d. Period arithmetic and period_range
import pandas as pd
p=pd.Period('2026-01',freq='M')
print(p+2, p+5, p-1, p-3)
print(pd.period_range('2026-01',periods=6,freq='M'))

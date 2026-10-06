# 6e. Convert frequency with asfreq
import pandas as pd
p=pd.Period('2026-01',freq='M')
print(p.asfreq('D',how='start'), p.asfreq('D',how='end'))
pi=pd.period_range('2026-01',periods=3,freq='M')
print(pi.asfreq('D',how='end'))

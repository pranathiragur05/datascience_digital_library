# 5e. Box plots for categorical variables
import pandas as pd, seaborn as sns, matplotlib.pyplot as plt
df=pd.DataFrame({'Department':['CSE']*5+['ECE']*5+['EEE']*5,
 'Marks':[78,85,90,72,88,65,70,82,75,80,60,68,72,76,85]})
sns.boxplot(x='Department',y='Marks',data=df)
plt.title("Marks Distribution by Department"); plt.show()

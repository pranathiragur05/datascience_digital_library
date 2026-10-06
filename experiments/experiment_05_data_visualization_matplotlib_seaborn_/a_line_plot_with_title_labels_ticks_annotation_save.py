# 5a. Line plot with title, labels, ticks, annotation, save
import matplotlib.pyplot as plt
months=["Jan","Feb","Mar","Apr","May","Jun"]
sales=[120,150,180,160,220,250]
fig,ax=plt.subplots(figsize=(8,4))
ax.plot(months,sales,marker="o",label="Sales")
ax.set_title("Monthly Sales"); ax.set_xlabel("Month"); ax.set_ylabel("Sales")
ax.set_xticks(range(6)); ax.set_xticklabels(months)
ax.annotate("Highest Sales",xy=(5,250),xytext=(3.5,262),arrowprops=dict(arrowstyle="->"))
ax.legend(); ax.grid(True)
plt.savefig("monthly_sales.png",dpi=300,bbox_inches="tight")
plt.show()

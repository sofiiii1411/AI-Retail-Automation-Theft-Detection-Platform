import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
import plotly.express as px
import numpy as np

# ----------------------------------
# 1. CONNECT TO FIREBASE
# ----------------------------------

cred = credentials.Certificate("retailpulseai-new-key.json")

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://retailpulseai-e2a4a-default-rtdb.firebaseio.com/"
    })

ref = db.reference("billing_records")
data = ref.get()

records = []

# ----------------------------------
# 2. CONVERT FIREBASE DATA → DATAFRAME
# ----------------------------------

if data:

    for key, value in data.items():

        items = value.get("items", [])

        for item in items:

            records.append({
                "date": value.get("date"),
                "time": value.get("time"),
                "product": item.get("productName"),
                "quantity": item.get("quantity"),
                "total": item.get("total"),
                "customer": value.get("customerID")
            })

else:
    print("No data found in Firebase")
    exit()

df = pd.DataFrame(records)

print("\nData Loaded Successfully\n")
print(df.head())

# ----------------------------------
# 3. DAILY SALES REPORT
# ----------------------------------

daily_sales = df.groupby("date")["total"].sum().reset_index()

print("\nDaily Sales")
print(daily_sales)

fig1 = px.line(
    daily_sales,
    x="date",
    y="total",
    title="Daily Revenue",
    template="plotly_dark",
    markers=True
)

fig1.update_traces(line=dict(color="cyan", width=4))
fig1.show()

# ----------------------------------
# 4. MONTHLY REVENUE
# ----------------------------------

# FIXED LINE
df["date"] = pd.to_datetime(df["date"], dayfirst=True)

df["month"] = df["date"].dt.month_name()

monthly_sales = df.groupby("month")["total"].sum().reset_index()

fig2 = px.bar(
    monthly_sales,
    x="month",
    y="total",
    title="Monthly Revenue",
    template="plotly_dark"
)

fig2.update_traces(marker_color="dodgerblue")
fig2.show()

# ----------------------------------
# 5. BEST SELLING PRODUCTS
# ----------------------------------

best_products = df.groupby("product")["quantity"].sum().reset_index()

fig3 = px.bar(
    best_products,
    x="product",
    y="quantity",
    title="Best Selling Products",
    template="plotly_dark"
)

fig3.update_traces(marker_color="deepskyblue")
fig3.show()

# ----------------------------------
# 6. LOW PERFORMING PRODUCTS
# ----------------------------------

low_products = best_products.sort_values(by="quantity").head(5)

fig4 = px.bar(
    low_products,
    x="product",
    y="quantity",
    title="Low Performing Products",
    template="plotly_dark"
)

fig4.update_traces(marker_color="red")
fig4.show()

# ----------------------------------
# 7. CUSTOMER BUYING TREND
# ----------------------------------

customer_trend = df.groupby("customer")["total"].sum().reset_index()

fig5 = px.bar(
    customer_trend,
    x="customer",
    y="total",
    title="Customer Spending",
    template="plotly_dark"
)

fig5.update_traces(marker_color="cyan")
fig5.show()

# ----------------------------------
# 8. BUSIEST HOUR ANALYSIS
# ----------------------------------

df["hour"] = pd.to_datetime(df["time"], format="%H:%M:%S").dt.hour

hourly_customers = df.groupby("hour")["customer"].count().reset_index()

fig6 = px.line(
    hourly_customers,
    x="hour",
    y="customer",
    title="Customers Per Hour",
    template="plotly_dark",
    markers=True
)

fig6.update_traces(line=dict(color="yellow", width=4))
fig6.show()

# ----------------------------------
# 9. AI SALES PREDICTION
# ----------------------------------

daily_sales["day_index"] = np.arange(len(daily_sales))

x = daily_sales["day_index"]
y = daily_sales["total"]

coefficients = np.polyfit(x, y, 1)

future_days = np.arange(len(daily_sales), len(daily_sales) + 7)

prediction = coefficients[0] * future_days + coefficients[1]

pred_df = pd.DataFrame({
    "day": future_days,
    "predicted_sales": prediction
})

fig7 = px.line(
    pred_df,
    x="day",
    y="predicted_sales",
    title="AI Future Sales Prediction",
    template="plotly_dark",
    markers=True
)

fig7.update_traces(line=dict(color="lime", width=4))
fig7.show()

print("\nAI Sales Prediction Completed Successfully")
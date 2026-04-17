import pandas as pd

# Load dataset
df = pd.read_csv("data/startups.csv")

print("Dataset loaded successfully\n")

# First 5 rows
print("First 5 rows:")
print(df.head())

# Column names
print("\nColumns:")
print(df.columns)

# Dataset info
print("\nInfo:")
df.info()

# Missing values
print("\nMissing Values:")
print(df.isnull().sum())


# Select important columns
df = df[[
    'Industry',
    'Funding Stage',
    'Total Funding ($M)',
    'Number of Employees',
    'Annual Revenue ($M)',
    'Customer Base (Millions)',
    'Success Score'
]]

print("Columns after selection:\n")
print(df.columns)

print("\nFirst 5 rows:\n")
print(df.head())


# Convert categorical data to numerical
df = pd.get_dummies(df, columns=['Industry', 'Funding Stage'])

print("After encoding:\n")
print(df.head())

print("\nColumns after encoding:\n")
print(df.columns)



# Create target column
df['Success Label'] = df['Success Score'].apply(
    lambda x: 1 if x >= 9 else (0 if x <= 4 else None)
)

# Remove only rows where label is None
df = df[df['Success Label'].notna()]

# Drop original column
df = df.drop('Success Score', axis=1)

print("Updated dataset:\n")
print(df.head())


# FEATURE ENGINEERING
df['Funding_per_Employee'] = df['Total Funding ($M)'] / (df['Number of Employees'] + 1)
df['Revenue_per_Employee'] = df['Annual Revenue ($M)'] / (df['Number of Employees'] + 1)
df['Revenue_to_Funding'] = df['Annual Revenue ($M)'] / (df['Total Funding ($M)'] + 1)
df['Revenue_per_Customer'] = df['Annual Revenue ($M)'] / (df['Customer Base (Millions)'] + 1)
df['Efficiency_Score'] = (
    (df['Annual Revenue ($M)'] / (df['Total Funding ($M)'] + 1)) +
    (df['Annual Revenue ($M)'] / (df['Number of Employees'] + 1))
)

# SPLIT THE DATASET
from sklearn.model_selection import train_test_split

X = df.drop('Success Label', axis=1)
y = df['Success Label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Data split done\n")

print("Training data size:", X_train.shape)
print("Testing data size:", X_test.shape)


# NORMALIZE THE DATA
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


# TRAIN LOGISTIC REGRESSION
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

model = LogisticRegression(max_iter=2000, class_weight='balanced')

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nLogistic Regression Accuracy:", accuracy)


import pickle

with open('model/logistic.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Logistic model saved")


# TRAIN RANDOM FOREST
from sklearn.ensemble import RandomForestClassifier

rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=2,
    class_weight='balanced',
    random_state=42
)

rf_model.fit(X_train, y_train)

rf_pred = rf_model.predict(X_test)

rf_accuracy = accuracy_score(y_test, rf_pred)

print("\nRandom Forest Accuracy:", rf_accuracy)


# TRAIN XGBOOST
from xgboost import XGBClassifier

xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')

xgb_model.fit(X_train, y_train)

xgb_pred = xgb_model.predict(X_test)

xgb_accuracy = accuracy_score(y_test, xgb_pred)

print("\nXGBoost Accuracy:", xgb_accuracy)


# FINAL RANDOM FOREST TRAIN (keeping your structure)
rf_model.fit(X_train, y_train)

rf_pred = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_test, rf_pred)

print("Random Forest Accuracy:", rf_accuracy)


# SAVE MODEL + SCALER + COLUMNS
import pickle

# Save model
with open('model/model.pkl', 'wb') as f:
    pickle.dump(rf_model, f)

# Save scaler
with open('model/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

# Save column order (VERY IMPORTANT for backend)
with open('model/columns.pkl', 'wb') as f:
    pickle.dump(X.columns.tolist(), f)

print("Model, scaler, and columns saved successfully")


print("Final training columns:")
print(X.columns)



# print all 3 accuracies
print("\nFinal Accuracies:")
print("\nLogistic Regression Accuracy:", accuracy)
print("Random Forest Accuracy:", rf_accuracy)
print("XGBoost Accuracy:", xgb_accuracy)
print("\nXGBoost Accuracy:", xgb_accuracy)
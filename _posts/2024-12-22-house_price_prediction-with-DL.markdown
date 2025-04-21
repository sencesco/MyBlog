---
layout: post
title: "Housing Price Prediction with Deep Learning"
excerpt: >
    Predicting house price advance regression technique using deep learning with tensorflow and keras.
date: 2024-12-22
categories: ["ML", "DL", "DA", "Python"]
image: /assets/image/post_image/house_price_dl_1.png
read_time: 7
github-repo: https://github.com/sencesco/Machine-Learning/blob/main/hose-price-advanced-dl.ipynb
colab-link: https://colab.research.google.com/github/sencesco/Machine-Learning/blob/main/hose-price-advanced-dl.ipynb
---

<div id="c-s-hlist">
    <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#dataset">Dataset</a></li>
        <li><a href="#building-the-model">Building the Model</a></li>
        <li><a href="#source-code">Source Code</a></li>
        <li><a href="#results">Results</a></li>
        <li><a href="#challenges-and-considerations">Challenges and Considerations</a></li>
        <li><a href="#conclusion">Conclusion</a></li>
    </ul>
</div>


# Overview
&emsp; From the project before, <span class="post-content-link"><a href="../20241212/house_price_prediction.html" target="_blank">House Price Prediction</a></span> we can specify that this is a regression problem. So in this challenge we will try to use deep learning to predict house prices. Because the dataset is the same as before, so we will use the same data pre-processing step but need not handle the outlier to try to capture a complex pattern with deep learning model.


## Tech Stack
- **Programming Language:** Python3
- **Data Hadnling:** Pandas, Numpy, Matplotlib, Seaborn, Scikit-learn, Scipy
- **Model Training & Evaluation:** Scikit-learn, keras with tensorflow
- **Version Control:** Git, GitHub


## Dataset
&emsp; We’ll use a dataset of hose prices from <span class="post-content-link"><a href="https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques/data" target="_blank"> House Prices - Advanced Regression Techniques</a></span>. This dataset contains 8p fetures and 1460 rows or means 1460 houses prices as the target.


## Building the Model
- **Data Preprocessing:** 
    - Import dataset and convert to dataframe
    - Feature Analysis for seperate categorical and numerical features
    - Handling missing values macthing with feature types and missing values types
    - Feature Encoding maching with feature types
    - Feature Selection with voting strategy with lasso selection, mutal information and spearman correlation


- **Model Architecture:**
    - <u>Input Layer:</u> A fully connected layer with input data and add L2 penalty (`kernel_regularizer=l2(0.01)`) that prevent model are overfitting by penalizing large weights.
    - <u>Dense Layer:</u> A fully connected layer where each neuron is connected.
    - <u>Leaky ReLU Activation:</u> A variant of the ReLU (Rectified Linear Unit) activation function. The standard ReLU returns 0 for negative values, but Leaky ReLU allows small negative values (by using a small slope alpha=0.1). This prevents "dead neurons" (neurons that stop learning) during training.
    - <u>Batch Normalization Layer:</u> This layer normalizes the output of the previous layer. It ensures that the activations remain in a range that is not too high or too low, which can stabilize and accelerate training. It also helps in mitigating the issue of internal covariate shift.
    - <u>Dropout Layer:</u> Dropout is a regularization technique to prevent overfitting. During training, it randomly "drops out" of specfic percent of the neurons in this layer. This forces the model to learn more robust features by not relying too heavily on any single neuron.
    - <u>Output Layer (for Regression):</u> This final layer outputs a single value, which is the prediction of the model. Since this is a regression problem, there’s no activation function applied, and the output is a continuous numerical value.
<pre class="scrollbar-x">
<code class="language-python">from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, LeakyReLU
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# Define the ANNs model
model = Sequential([
    Dense(256, input_shape=(X_train_scaled.shape[1],), kernel_regularizer=l2(0.01)),
    LeakyReLU(alpha=0.1),
    BatchNormalization(),
    Dropout(0.3),
    Dense(128, kernel_regularizer=l2(0.01)),
    LeakyReLU(alpha=0.1),
    BatchNormalization(),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dense(1)  # Output layer for regression
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.01), loss='huber', metrics=['mae', 'mse'])
model.summary()</code>
</pre>
<div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/house_price_dl_model_1.png" alt="Model Summary" style="width: 75%;">
</div>

- **Training and Evaluation**
    - Trained using the training and validation sets
    - Monitored accuracy and loss curves from training and validation sets
    - Evaluated model with Residual Analysis
    - fine-tune the hyperparameters or architecture, if model performance is not good enough for better performance.
    - Evaluated model with test set


## Source Code
<div class="post-content-link">
    <ul>
        <li>
        You can find all the source code on
        <a href="https://github.com/sencesco/Machine-Learning/blob/main/hose-price-advanced-dl.ipynb" target="_blank" alt="GitHub-repo/hose-price-advanced-dl">
            GitHub
        </a>
        </li>
    </ul>
</div>


## Results
- **Accuracy and loss curves:** We can see that the red line (train set) and the blue line (val set) are crossing each other, indicating that the model is learning and generalizing well. And I added early stopping and learning rate scheduler to prevent overfitting. And then the model are stopping at 49 epochs from setting with 100 epochs.
    <div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/house_price_dl_result_1.png" alt="Accuracy and Loss Curves" style="width: 100%;">
    </div>

- **Evaluation with Validation Sets:**
<pre class="scrollbar-x">
<code class="language-python"># Predict on the validation set
y_pred = model.predict(X_validate_scaled).flatten()

# Calculate evaluation metrics
rmse = np.sqrt(mean_squared_error(y_validate, y_pred))
mae = mean_absolute_error(y_validate, y_pred)
r2 = r2_score(y_validate, y_pred)
rmsle = np.sqrt(mean_squared_error(np.log1p(y_validate), np.log1p(np.clip(y_pred, a_min=0, a_max=None))))

# Print evaluation results
print("\nValidate set evaluation")
print(f"Root Mean Square Error (RMSE): {rmse:.2f}")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"R-Squared (R2): {r2:.2f}")
print(f"Root Mean Square Logarithmic Error (RMSLE): {rmsle:.4f}")</code>
</pre>
<pre class="output">
10/10 ━━━━━━━━━━━━━━━━━━━━ 0s 7ms/step

Validate set evaluation
Root Mean Square Error (RMSE): 25638.22
Mean Absolute Error (MAE): 15521.76
R-Squared (R2): 0.91
Root Mean Square Logarithmic Error (RMSLE): 0.1295
</pre>

- **Residual Analysis:** 
    <div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/house_price_dl_result_2.png" alt="Residual Analysis Plot" style="width: 100%;">
    </div>
    <pre class="output">
Detected polynomial order: 5
The relationship appears to be non-linear (order 5)</pre>
    - <u>Residual plot:</u> The residuals are scattered randomly around the horizontal line at zero, suggesting that it is a good sign for the model’s reliability. But some points seem to deviate too much from the line that may be due to overfitting.
    - <u>Histogram of Residuals:</u> The histogram shows a roughly bell-shaped distribution, which is desirable. even a few outliers can make model stability but in this case, some outliers may be due to overfitting.
    - <u>Q-Q Plot of Residual:</u> The points in the Q-Q plot generally follow the diagonal line, indicating that the residuals are approximately normally distributed. This is consistent with the histogram. And a few points deviate from the line, again highlighting the presence of outliers.
    - <u>Actual vs. Predicted:</u> The green line representing the model's predictions being close to the perfect prediction line (dashed red line) suggests a good fit as a non-linear relationship with polynomial order 5. However, this model seems to be overfitting the data from the point that is very close to the model prediction line.

- **Test Set Performance:**
<pre class="scrollbar-x">
<code class="language-python"># Ensure X_test is scaled using the same scaler
X_test_scaled = scaler.transform(X_test)

# Predict the SalePrice for the test set
y_pred_test = model.predict(X_test_scaled)

# Create a DataFrame for the output
submission = pd.DataFrame({
    'Id': X_test.index,  # Make sure X_test has an index that corresponds to IDs
    'SalePrice': y_pred_test.flatten()  # Flatten to ensure it's a 1D array for the 'SalePrice' column
})

# Save the predictions to a CSV file
submission.to_csv('submission_ann.csv', index=False)

print("Predictions saved to 'submission_ann.csv'")</code>
</pre>
<pre class="output">
46/46 ━━━━━━━━━━━━━━━━━━━━ 0s 1ms/step 
Predictions saved to 'submission_ann.csv'
</pre>

Kaggle will show model performance based on RMSLE (Root Means Square Log Error) that the result on test set is 0.14749


## Challenges and Considerations
- **Data Quality:** In this challenge, I try to avoid outlier handling, and the model can capture them, which is good performance. In the other way, that means a model due to outliers can be overfitting. Then handling or keeping some outliers can make more data good quality and contain some bias for a more flexible model.
- **Model Architecture:** Even if I add a regularization and normalization layer to avoid overfitting, based on data quality, this model is still overfitting. In addition, the complexity of the model with more neurons in the dense layer may be more complex than this problem.
- **Model Tuning:** In this model, the setting of the learning rate using `Adam(learning_rate=0.01)`: this is quite high for Adam. Often 0.001 or even 0.0005 is more stable


## Conclusion
&emsp; From my experience with this challenge, outlier handling can be significant to data quality and model bias. Even a deep learning model can capture all the complex relationships but is at high risk of overfitting. So the leverage of data quality and model bias can make a model more efficient and more flexible when predicting with unseen data. 

&emsp; In model architecture, the complexity of the model with more neurons will make the model more complex than less flexible upon sizing of data. So capable of them is also important. And hyperparameter tuning, such as learning rate, etc., can make a model more efficient and more flexible when predicting with unseen data if they are optimal.

&emsp; If you found this project useful, feel free to share it, Thanks for reading!
---
layout: post
title: "Housing Price Prediction"
excerpt: >
    Structured ML pipeline for housing price regression—feature engineering, stacked models, and blending strategies to improve generalization beyond single-model baselines.
date: 2024-12-12
categories: ["ML", "DA", "Python"]
image: /assets/image/post_image/house_price_1.png
read_time: 7
github-repo: https://github.com/sencesco/Machine-Learning/blob/main/hose-price-advanced.ipynb
colab-link: https://colab.research.google.com/github/sencesco/Machine-Learning/blob/main/hose-price-advanced.ipynb
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
&emsp;  In this challenge are house price prediction that is a regression problem, I am using a machine learning model to predict house prices. That using a stacking strategy to make predictions gets better with multiple machine learning models. Then, using a blending model for the weight of each model prediction to avoids overfitting from the stacking strategy. This dataset has many features, about 80 features and when encoding the feature will increasing, so we need to reduce features with feature selection that uses a voting strategy for this challenge.


## Tech Stack
- **Programming Language:** Python3
- **Data Hadnling:** Pandas, Numpy, Matplotlib, Seaborn, Scikit-learn, Scipy
- **Model Training & Evaluation:** Scikit-learn, lightgbm, catboost, xgboost
- **Version Control:** Git, GitHub


## Dataset
&emsp; We’ll use a dataset of hose prices from <span class="post-content-link"><a href="https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques/data" target="_blank"> House Prices - Advanced Regression Techniques</a></span>. This dataset contains 8p fetures and 1460 rows or means 1460 houses prices as the target.


## Building the Model
- **Data Preprocessing:** 
    - Import dataset and convert to dataframe
    - Feature Analysis for seperate categorical and numerical features
    - Handling missing values macthing with feature types and missing values types
    - Feature Encoding maching with feature types
    - Outlier handling for numerical features
    - Feature Selection with voting strategy with lasso selection, mutal information and spearman correlation

- **Model Algorithm:** 
    - Start with multiple machine learning models and run all models as single prediciton for get each model performance
    - Choose a best model for stacking and blending:
        <div style="text-align: center; margin: 10px auto">
            <img src="{{ site.baseurl }}/assets/image/post_image/house_price_model_1.png" alt="model performance list" style="width: 90%;">
        </div>
    From above figure, I use the base model as:  
        - `RidgeRegression` for simple linear regression prediciton
        - `CategoricalBoosting` for many categorical features that contain in our dataset with gradient boosting trees
        - `lightgbm` for learninig with gradient boosting trees that faster than `xgboost` 
        
        All of this model that I selected as L0 model (base model for stacking) are not the best model from top list of model performance. But with leveraged model with both of simple linear regression and other strategies will help model perform better and model can be more flexible.
    
    - Then Trainning the L0 model together with `StackingRegressor` for get their weight prediction as base model for blending model:
        <div style="text-align: center; margin: 10px auto">
            <img src="{{ site.baseurl }}/assets/image/post_image/house_price_model_2.png" alt="l0 and stacking model score" style="width: 85%;">
        </div>
    - Get the weight of prediction from base model (after training stacking model) then optimize weights and use in blending model to final prediction.
<pre class="scrollbar-x">
<code class="language-python">from scipy.optimize import minimize

def blending_model(X_val, y_val, base_models):
    # Step 1: Get predictions from all base models
    base_predictions = []
    for name, model in base_models:
        preds = model.predict(X_val)  # Predict on the validation set
        base_predictions.append(preds)
    
    # Convert predictions to a matrix (each column is predictions from a base model)
    base_predictions = np.column_stack(base_predictions)
    
    # Step 2: Optimize weights for blending
    def loss_function(weights):
        blended_preds = np.dot(base_predictions, weights)  # Weighted sum of predictions
        return np.sqrt(mean_squared_error(y_val, blended_preds))  # RMSE

    constraints = {'type': 'eq', 'fun': lambda w: np.sum(w) - 1}  # Constraints: Weights must sum to 1
    bounds = [(0, 1)] * base_predictions.shape[1]  # Bounds: Weights must be between 0 and 1
    initial_weights = [1 / base_predictions.shape[1]] * base_predictions.shape[1]  # Initial weights (equal weights)
    result = minimize(loss_function, initial_weights, constraints=constraints, bounds=bounds)  # Optimize weights using scipy

    # Step 3: Get optimized weights
    optimized_weights = result.x
    print("Optimized Weights:", optimized_weights)

    # Step 4: Define the blended model as a simple weighted average of base models
    def blended_model(X):
        base_preds = []
        for name, model in base_models:
            preds = model.predict(X)  # Predict on the input X using the base model
            base_preds.append(preds)
        base_preds = np.column_stack(base_preds)
        return np.dot(base_preds, optimized_weights)  # Weighted sum of predictions

    # Step 5: Calculate RMSE for the blended model
    blended_predictions = blended_model(X_val)
    rmse = np.sqrt(mean_squared_error(y_val, blended_predictions))
    mae = mean_absolute_error(y_val, blended_predictions)
    r2 = r2_score(y_val, blended_predictions)
    rmsle = np.sqrt(mean_squared_error(np.log1p(y_val), np.log1p(np.clip(blended_predictions, a_min=0, a_max=None))))
    
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE: {mae:.4f}")
    print(f"R2 Score: {r2:.4f}")
    print(f"RMSLE: {rmsle:.4f}")
    
    return blended_model, optimized_weights</code>
</pre>

- **Training and Evaluation**
    - Trained using the training and validation sets
    - Evaluated model with Residual Analysis
    - Fine-tune the hyperparameters, if model performance is not good enough for better performance.
    - Evaluated model with test set

## Source Code
<div class="post-content-link">
    <ul>
        <li>
        You can find all the source code on
        <a href="https://github.com/sencesco/Machine-Learning/blob/main/hose-price-advanced.ipynb" target="_blank" alt="GitHub-repo/house-price-advanced">
            GitHub
        </a>
        </li>
    </ul>
</div>


## Results
- **Evaluation with Validation Sets:**
<pre class="scrollbar-x">
<code class="language-python">start_time = time.time()
print("Starting run blending model...\n")

# Run the blending model function
blended_model, optimized_weights = blending_model(X_validate, y_validate, base_models)

training_time = time.time()- start_time
hours, remainder = divmod(training_time, 3600)
minutes, seconds = divmod(remainder, 60)

print(f"\nModel are blended, usage time is {int(hours):02}:{int(minutes):02}:{int(seconds):02} (hh:mm:ss).")</code>
</pre>
<pre class="output">
Starting run blending model...

Optimized Weights: [6.27950553e-01 3.72049424e-01 2.49104347e-08 2.59716902e-12]
RMSE: 20871.7407
MAE: 13751.3680
R2 Score: 0.9257
RMSLE: 0.1146

Model are blended, usage time is 00:00:00 (hh:mm:ss).
</pre>

- **Residual Analysis:** 
    <div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/house_price_result_1.png" alt="Residual Analysis Plot" style="width: 100%;">
    </div>
    <pre class="output">
Detected polynomial order: 1
The relationship appears to be linear</pre>
    - <u>Residual plot:</u> The residuals are scattered randomly around the horizontal line at zero, suggesting that it is a good sign for the model’s reliability.
    - <u>Histogram of Residuals:</u> The histogram shows a roughly bell-shaped distribution, which is desirable. The histogram also has a few outliers, even if we remove outliers but just roughly consider the outliers detected. But a few outliers can make model stability.
    - <u>Q-Q Plot of Residual:</u> The points in the Q-Q plot generally follow the diagonal line, indicating that the residuals are approximately normally distributed. This is consistent with the histogram. And a few points deviate from the line, again highlighting the presence of outliers.
    - <u>Actual vs. Predicted:</u> The green line representing the model's predictions being close to the perfect prediction line (dashed red line) suggests a good fit as a linear relationship with polynomial order 1. However, if the model attempts to fit all points exactly, it may indicate overfitting, especially if the true relationship between the features and the target variable is not inherently linear.

- **Test Set Performance:**
<pre class="scrollbar-x">
<code class="language-python"># Predict the SalePrice for the test set
y_pred_test = blended_model(X_test)

# Create a DataFrame for the output
submission = pd.DataFrame({
    'Id': X_test.index,  # Make sure X_test has an index that corresponds to IDs
    'SalePrice': y_pred_test
})

# Save the predictions to a CSV file
submission.to_csv('submission_blending.csv', index=False)

print("Predictions saved to 'submission_blending.csv'")</code>
</pre>
<pre class="output">
Predictions saved to 'submission_blending.csv'
</pre>

Kaggle will show model performance based on RMSLE (Root Means Square Log Error) that the result on test set is 0.13422.


## Challenges and Considerations
- **Data Quality:** High-quality and domain specific knowledge are crucial for data quality and feature selection. That will help pre-processing of data will improve more data quality.
- **Model Algorithm:** Select the optimized model will help model performance and also help model more flexible but may be not the best model from top list of model performance.
- **Model Tuning:** Hyperparameter tuning to fine-tune the model's performance and avoid overfitting. But if use cross-validation will spend more time, so heuristic approach will help you to find the best set of hyperparameters in a short amount of time.


## Conclusion
&emsp; From my experience with this challenge, hyperparameter tuning I estimate from my heuristic approach instead of cross-validation for computational limitations and to speed up training. In evalutation model with validation set and residual analysis show model preformance are good with stacking and blending model with RMSLE 0.1146. But when we evaluate model with test set, RMSLE is 0.13422, this means model will need to improve more data quality, feature selection or hyperparameter tuning for make model more efficient and more flexible when predict with unseen data.

&emsp; If you found this project useful, feel free to share it, Thanks for reading!
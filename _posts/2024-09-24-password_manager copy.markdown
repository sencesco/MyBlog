---
layout: post
title: "Password Manager"
excerpt: >
    This project was built using Python with the Tkinter library for GUI. 
    To generate a password with a random  mix of letters, numbers, and symbols.
date: 2023-08-23
categories: ["AI", "DL"]
image: https://raw.githubusercontent.com/sencesco/Application/main/Password%20Manager%20V.1.1/logo.png
image-content: /assets/image/project_image/test.png
read_time: 2
github-repo: https://github.com/sencesco/Machine-Learning/blob/main/Frozen%20Lake_RL.ipynb
colab-link: https://colab.research.google.com/github/sencesco/Machine-Learning/blob/main/Frozen%20Lake_RL.ipynb
---

<div id="c-s-hlist">
    <ul>
        <li><a href="#what-is-performance-measurement">What is Performance Measurement?</a></li>
        <li><a href="#what-is-auc-roc-curve">What is AUC-ROC curve?</a></li>
        <li><a href="#auc-roc-curve">AUC-ROC Curve</a></li>
    </ul>
</div>

## What is Performance Measurement?
Performance Measurement is an essential task for any machine learning project, it is very important to check how good or bad our model is. We use R squared (R²) and Root mean squared error (RMSE) when it comes to regression models. In case of classification models, we can rely on an AUC-ROC curve or CAP curve, when we need to evaluate or illustrate the performance of a multi-class classification issue.

## What is AUC-ROC curve?
AUC (Area Under The Curve) ROC (Receiver Operating Characteristics) curve, also known as AUROC (Area Under the Receiver Operating Characteristics) is a performance measurement for classification problems at various threshold levels. It is one of the most significant evaluation measures for assessing the performance of binary classification problems.
ROC is a probability curve that plots the TPR (True Positive Rate) against FPR (False Positive Rate). AUC is the measure of separability, it shows how much our model is capable to distinguish between classes.
The AUC indicates how well the model distinguishes between positive and negative classes. The greater the AUC, the better.


## AUC-ROC Curve
What is CAP curve?
A CAP (Cumulative Accuracy Profile) curve is a performance measurement for classification problems. It is used to evaluate a model by comparing the current curve to both the ‘perfect’ or ‘ideal’ curve and a ‘randomized’ curve.
A decent or good model will have a CAP that is in the middle of the perfect and random curves. The closer a model is to the perfect CAP, the better is.
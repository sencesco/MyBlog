---
layout: post
title: "Dog Breed Prediction App"
excerpt: >
    End-to-end computer vision application for multi-class dog breed prediction from input images using deep learning for classification—image preprocessing, CNN training, and model evaluation.
date: 2024-10-17
categories: ["ML", "DL", "Computer Vision", "Python"]
image: /assets/image/post_image/dog_breed_1.png
read_time: 6
github-repo: https://github.com/sencesco/dog-breed-prediction-streamlit-app
colab-link: https://colab.research.google.com/github/sencesco/Deep-Learning/blob/main/dog-breed-prediction.ipynb
---

<div id="c-s-hlist">
    <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#live-demo">Live Demo</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#dataset">Dataset</a></li>
        <li><a href="#building-the-model">Building the Model</a></li>
        <li><a href="#source-code">Source Code</a></li>
        <li><a href="#results">Results</a></li>
        <li><a href="#challenges-and-considerations">Challenges and Considerations</a></li>
        <li><a href="#conclusion">Conclusion</a></li>
    </ul>
</div>

## Overview
&emsp; In this challenge, are dog breed prediction that is a classification problem. I am using a deep learning model to predict dog breeds from images. This focuses on building a classifier that can predict 50 dog breeds classes using convolutional neural networks (CNNs). The actual dataset is 120 classes but for computational limitations and to speed up training, I decided to use 50 classes. And using <span class="post-content-link"><a href="https://www.ibm.com/topics/transfer-learning" target="_blank">transfer learning</a></span> with a pretrained model named's MobileNetV2 from Keras Applications. And I deploy the model using Streamlit.


## Live Demo

<p style="margin-bottom: 6px;">
  You can try the deployed Streamlit application here:
  <a href="https://dog-breed-prediction-qlqm2.streamlit.app/" target="_blank" rel="noopener noreferrer">
    🚀 Launch Live Streamlit App
  </a>
</p>

<p style="margin-top: 6px;">
  A live preview is also embedded below. Streamlit apps may not always load correctly inside an iframe, so the live app is opened in a new tab for the best user experience.
</p>


<div class="streamlit-demo-wrapper">
  <iframe
    class="streamlit-demo-iframe"
    src="https://dog-breed-prediction-qlqm2.streamlit.app/?embedded=true"
    loading="lazy">
  </iframe>
</div>


## Tech Stack
- **Programming Language:** Python3
- **Data Hadnling:** Pandas, Numpy, Matplotlib, Seaborn, Scikit-learn, keras
- **Model Training & Evaluation:** Scikit-learn, Keras
- **Version Control:** Git, GitHub
- **Deployment:** Streamlit


## Dataset
&emsp; We’ll use a dataset of dog images from <span class="post-content-link"><a href="https://www.kaggle.com/datasets/catherinehorng/dogbreedidfromcomp" target="_blank">Kaggle's Dog Breed Identification dataset</a></span>. This dataset contains 120 dog breeds and images of dog per class between 60-120 images. And labels are stored in the `labels.csv` file with pairs of (filename, label).


## Building the Model
- **Data Preprocessing:** 
    - Loaded images using Keras
    - Resized to 224x224 pixels
    - Normalized pixel values (divided by 255)
    - Converted labels using LabelBinarizer (One-Hot Encoding)
    - Split data into training, validation, and test sets

- **Model Architecture:** 
    - Using `MobileNetV2` with pre-trained weights from ImageNet (`include_top=True`).
    - Freeze all CNN layers, meaning their weights won't be updated during training. 
    - Add several dense layers on top of the `MobileNetV2`. this dense layers are fully connected layer for trainable.
    - Final dense layer with 50 outputs for 50 classes. Using `softmax` activation function for classification task.
<pre class="scrollbar-x">
<code class="language-python">from keras.applications import MobileNetV2
from keras import Sequential
from keras.layers import Dense, Flatten
from keras.optimizers import Adam

# Load pre-trained MobileNetV2 model
# include_top: whether to include the 3 fully-connected layers at the top of the network.
base_model = MobileNetV2(
    weights='imagenet',
    include_top=True,
    input_shape=(224, 224, 3),
    pooling='max',
    classifier_activation="softmax"
)

# Freeze the convolutional layers
for layer in base_model.layers:
    layer.trainable = False

# Create a new model on top of the MobileNetV2 base
model = Sequential()
model.add(base_model)
model.add(Flatten())
model.add(Dense(724, activation='relu'))
model.add(Dense(512, activation='relu'))
model.add(Dense(256, activation='relu'))
model.add(Dense(256, activation='relu'))
model.add(Dense(128, activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(Y_data.shape[1], activation='softmax'))  # Adjust the number of classes based on your dataset

# Compile the model
model.compile(loss = 'categorical_crossentropy', optimizer = Adam(0.0001),metrics=['accuracy'])

model.summary()</code>
</pre>
<div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/dog_breed_model_1.png" alt="Model Summary" style="width: 75%;">
</div>


- **Training and Evaluation**
    - Trained using the training and validation sets
    - Monitored accuracy and loss curves from training and validation sets
    - Evaluated model with test set
    - fine-tune the hyperparameters or architecture, if model performance is not good enough for better performance.


## Source Code
<div class="post-content-link">
    <ul>
        <li>
        You can find all the source code on
        <a href="https://github.com/sencesco/Deep-Learning/blob/main/dog-breed-prediction.ipynb" target="_blank" alt="GitHub-repo/dog-breed-prediction">
            GitHub
        </a>
        </li>
    </ul>
</div>


## Results
- **Accuracy and loss curves:** We can see that the red line (train set) and the blue line (val set) are crossing each other, indicating that the model is learning and generalizing well. But after 10 epochs, the blue line start to stabe and the red line: accuracy start to increase and loss start to decrease. This can detect overfitting is comming. We can actually stop training after 10 epochs but from start we can not know certain epoch is good or not. Then for further training, we can use early stopping for handling this problem.
<div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/dog_breed_result_1.png" alt="Accuracy Curves" style="width: 48%;">
    <img src="{{ site.baseurl }}/assets/image/post_image/dog_breed_result_2.png" alt="Loss Curves" style="width: 48%;">
</div>

- **Test Set Performance:** The model achieved an accuracy of 0.80 on the test set, indicating that it performed well on unseen data. And further training, we can improve the accuracy with more pre-processing and fine-tuning the model.
<pre class="scrollbar-x">
<code class="language-python">Y_pred = model.predict(X_test)
score = model.evaluate(X_test, Y_test)
print('Accuracy over the test set: \n ', round((score[1]*100), 2), '%')</code>
</pre>
<pre class="output">
14/14 [==============================] - 2s 46ms/step
14/14 [==============================] - 0s 30ms/step - loss: 0.9215 - accuracy: 0.8086
Accuracy over the test set: 
  80.86 %
</pre>

- **Prediction Example**
<pre class="scrollbar-x">
<code class="language-python"># Plotting image to compare
plt.imshow(X_test[1,:,:,:])
plt.show()

# Finding max value from predition list and comaparing original value vs predicted
print("Originally : ",labels['breed'][np.argmax(Y_test[1])])
print("Predicted : ",labels['breed'][np.argmax(Y_pred[1])])</code>
</pre>
<div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/dog_breed_result_3.png" alt="Prediction Accuracy" style="width: 48%;">
</div>
<pre class="output">
Originally :  dhole
Predicted :  dhole
</pre>


## Challenges and Considerations
- **Data Quality:** High-quality and diverse data are crucial for training an effective model. If the dataset is biased or lacks variety, the model may not perform well
- **Model Size vs Accuracy:** MobileNetV2 is lightweight and fast, but may not be the most accurate.
- **Model Tuning:** Fine-tuning the model's hyperparameters, such as the learning rate, batch size, and number of epochs, is essential for achieving optimal performance.
- **Overfitting:** To avoid overfitting, use techniques such as dropout, regularization, or data augmentation.


## Conclusion
&emsp; From my experience with this challenge, I chose MobileNetV2 as the model architecture for concern about model size that this architecture will lightweight size of model. But for the image classification problem, some architectures will be more suitable for this dataset, May be: EfficientNet, ResNet,VGG16/VGG19 and etc., that will use a larger model size than MobileNetV2. You could see more information about architecture in <span class="post-content-link"><a href="https://keras.io/api/applications/" target="_blank">Keras Applications</a></span>. And add some pre-processing for example: Contrast enhancement, histogram equalization, and so on. Can help a model perform better.

&emsp; So in the real world, considering a matching dataset with a suitable architecture will make it perform better. And if we can use a lighter model, it will be better, but we need to consider the characteristics of architecture first for model performance.

&emsp; If you found this project useful, feel free to share it, Thanks for reading!
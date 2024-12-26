---
layout: post_ipynb
title: "Dog Breed Prediction"
excerpt: >
    Predicting dog breed from images.
date: 2024-10-17
categories: ["ML","DL","Computer Vision", "Python"]
image: /assets/image/post_image/dog_breed_1.png
read_time: 6
github-repo: https://github.com/sencesco/Artificial-Intelligence/blob/main/Dog%20Breed%20Prediction%20(50%20class%20prediction)/Kaggle%20notebook%20Code/dog-breed-prediction.ipynb
colab-link: https://colab.research.google.com/github/sencesco/Artificial-Intelligence/blob/main/Dog%20Breed%20Prediction%20(50%20class%20prediction)/Kaggle%20notebook%20Code/dog-breed-prediction.ipynb
---

<div id="c-s-hlist">
    <ul>
        <li><a href="#intro">Intro</a></li>
        <li><a href="#loading-library">Import library and Data Exploration</a></li>
        <li><a href="#image-processing">Image Processing</a></li>
        <li><a href="#building-model">Building a Model</a></li>
        <li><a href="#training-model">Training a Model</a></li>
        <li><a href="#evaluation">Evaluation</a></li>
        <li><a href="#closing-words">Closing words</a></li>
    </ul>
</div>


## Intro
{{ site.tabc }} In this challenge, I using a deep learning model to predict dog breeds from images. This focuses on building a classifier that can predict 50 dog breeds classes using convolutional neural networks (CNNs). The actual dataset is 120 classes but for faster and computational limitations in training I decided to use 50 classes. And using <span class="post-content-link"><a href="https://www.ibm.com/topics/transfer-learning" target="_blank">transfer learning</a></span> with a pretrained model named's MobileNetV2 from Keras. I used <span class="post-content-link"><a href="https://www.kaggle.com/datasets/catherinehorng/dogbreedidfromcomp" target="_blank">Kaggle's Dog Breed Identification dataset</a></span> for this challenge, and the model was built using TensorFlow/Keras.

<div id="notebook-content">
    https://raw.githubusercontent.com/sencesco/Artificial-Intelligence/refs/heads/main/Dog%20Breed%20Prediction%20(50%20class%20prediction)/Kaggle%20notebook%20Code/dog-breed-prediction.ipynb
</div>
<script id="notebook-filters-ignore" type="application/json"> 
    {
        "markdown": { 
            "id": ["dFONdRncx8Cr"]
        },
        "code": {   
            "timestamp": [] 
        }
    }
</script>
<script id="notebook-filters-add_tag" type="application/json"> 
    {
        "markdown": { 
            "id_pair": [
                {   "id": "-__laGLPOgx0", 
                    "tag": "<h2 id='building-model'>Building a Model</h2>" 
                }
            ]
        },
        "code": {   
            "timestamp": [
                {   "timestamp": 1704858635237, 
                    "tag": "<h2 id='loading-library'>Import library and Data Exploration</h2><p>{{ site.tabc }}First we need to import required libraries for using pre-processing and building a model. And explore a dataset for understanding data information before building a model.</p>" 
                },
                {   "timestamp": 1704858657014, 
                    "tag": "<h2 id='image-processing'>Image pre-processing</h2><p>{{ site.tabc }}Then this dataset is images. So we need to do pre-processing to make it ready for building a model. That we need to convert images into a numpy array for computer vision can read image information and process to a model.</p>" 
                },
                {   "timestamp": 1704858771939,
                    "tag": "<h2 id='training-model'>Training a Model</h2><p>{{ site.tabc }}Choosing an optimal batch size and epochs will help a model achieve better accuracy.</p>"
                },
                {
                    "timestamp": 1704858814975,
                    "tag": "<h2 id='evaluation'>Evaluation</h2>"
                }
            ] 
        }
    }
</script>

## Closing words
{{ site.tabc }} From my experience with this challenge, I found the weakness thing when again future data is being used. That I chose MobileNetV2 from I mention before but in another reason for concern about model size that this architecture will lightweight size of model. But for the image classification problem, some architectures will be more suitable for this dataset, like EfficientNet, ResNet,VGG16/VGG19 and etc., that will use a larger model size than MobileNetV2. You could see more information about architecture in <span class="post-content-link"><a href="https://keras.io/api/applications/" target="_blank">Keras Applications</a></span>.

{{ site.tabc }} So in the real world, considering a matching dataset with a suitable architecture will make it perform better. And if we can use a lighter model, it will be better, but we need to consider the characteristics of architecture first for model performance.

{{ site.tabc }} If you found this challenge helpful, feel free to share it. Don’t forget to check out my other projects for more coding inspiration. Enjoy reading!

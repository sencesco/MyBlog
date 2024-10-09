---
layout: post
title: "Video to image with OpenCV in Python"
excerpt: >
    This post will show how to convert video to image with OpenCV.
    Used structural similarity to reduce generation of duplicate images.
date: 2024-10-07
categories: ["Computer Vision"]
image: /assets/image/post_image/video_to_img_1.png
image-content: /assets/image/post_image/video_to_img_2.png
read_time: 3
github-repo: https://github.com/sencesco/Computer-Vision/blob/main/video_to_img%20V1.1.py
---

<div id="c-s-hlist">
    <ul>
        <li><a href="#How-it-works">How it works</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#coding-walkthrough">Coding Walkthrough</a></li>
        <li><a href="#closing-words">Closing words</a></li>
    </ul>
</div>

## How it works
{{ site.tabc }} This post will show how to convert video frames to images using OpenCV in Python. The script allows you to customize parameters such as the frame skip interval and similarity threshold for the extracted images.

## Tech Stack
- **Programming Language:** Python3
- **Computer Vision Library:** OpenCV, Skimage

## Coding Walkthrough

<div class="code-wrapper">
    <button data-url="https://raw.githubusercontent.com/sencesco/Computer-Vision/refs/heads/main/video_to_img%20V1.1.py">video_to_img V1.1.py</button>
    <button id="copy-button">Copy</button> 
</div>
<pre class="scrollbar"><code class="language-python" id="code-display"></code></pre>
<br>


<div class="stack-container">
<div class="code-description" markdown="1">

- **video_to_img V1.1.py:**
    - `Customization Options` You can adjust the following parameters:
      - `SIMILARITY_THRESHOLD`: Define how much the frame must differ from the previous one to be saved.
      - `SKIP_FRAMES`: Set how often to extract frames (e.g., every 5th frame).
      - `WIDTH_PROCESSING`: Set the width of the processed image.
      - `HEIGHT_PROCESSING`: Set the height of the processed image.

    - `def calculate_ssim()`: This function will compare simility between two images by using structural similarity index (SSIM).
    Before calculating SSIM, the images will need to be pre-procesing for better comparison. before that, the images will be converted to grayscale
    and resized image to smaller size for performance of pre-processing. And using pre-processing techniques in this post using reduce a noise and edge detection. Then SSIM will measure the two images in terms of luminance, contrast, and structure.

    - `cv2.VideoCapture()`: We use this function to read the video file.

    - `Looping`: We will loop through each frame of the video that starting from frame 0 and compare it with the previous frame. If the similarity is above a certain threshold, we will skip the current frame. If the similarity is below the threshold, we will save the current frame as an image.

</div>
</div>


## Closing words
{{ site.tabc }} This Python script, using OpenCV, makes video to image conversion efficient and customizable. You can tweak various parameters to suit your needs and extract relevant frames from any video. Whether you're working on video analysis or creating time-lapse sequences, this approach simplifies the task.

{{ site.tabc }} If you found this project helpful, feel free to share it. Don’t forget to check out my other projects for more coding inspiration. Enjoy reading!
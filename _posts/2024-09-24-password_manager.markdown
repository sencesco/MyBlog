---
layout: post
title: "Password Manager V.1.2.0"
excerpt: >
    This application was built using Python with the Tkinter library for GUI. 
    To generate a password with a random  mix of letters, numbers, and symbols.
date: 2024-09-28
categories: ["Misc", "Python"]
image: https://raw.githubusercontent.com/sencesco/Application/main/Password%20Manager%20V.1.2.0/logo.png
image-content: /assets/image/post_image/pwd_mgr_1.png
read_time: 4
github-repo: https://github.com/sencesco/Application/tree/main/Password%20Manager%20V.1.2.0
---

<div id="c-s-hlist">
    <ul>
        <li><a href="#what-is-password-manager">What is Password Manager?</a></li>
        <li><a href="#download">Download</a></li>
        <li><a href="#feature">Feature</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#coding-walkthrough">Coding Walkthrough</a></li>
        <li><a href="#closing-words">Closing words</a></li>
    </ul>
</div>

## What is Password Manager?
{{ site.tabc }} Password Manager is a secure application designed to help users store, manage, and organize their passwords in one centralized location. The application employs strong encryption techniques to ensure that all user credentials are kept safe and accessible only to the user. With a user-friendly interface, it simplifies the process of creating and managing strong passwords, enhancing overall security for online accounts.

## Download
<div class="post-content-link">
    <ul>
        <li>
        <a href="https://raw.githubusercontent.com/sencesco/Application/refs/heads/main/Password%20Manager%20V.1.2.0/pwd-mgr-v1.2.0.rar">
            Password_Manager_main_V.1.2.0
        </a>
        </li>
    </ul>
</div>
After downloaded, unzip the zip file and run the Password_Manager_main_V.1.2.0.exe.

## Feature
- **Password Generation:** Automatically generate secure passwords with a mix of characters.
- **Multi-User Support:** Support multiple users with different passwords.
- **Search Functionality:** Quickly find stored passwords using a search feature.
- **Clear User Data:** Can clear user data from the application.
- **Password Storage:** Store and retrieve passwords securely in JSON format.
- **User-Friendly UI:** Built with Tkinter for an intuitive graphical interface.


## Tech Stack
- **Programming Language:** Python3
- **UI Library:** Tkinter
- **File Handling:** JSON
- **Version Control:** Git, GitHub

## Coding Walkthrough

<div class="code-wrapper">
    <button data-url="https://raw.githubusercontent.com/sencesco/Application/refs/heads/main/Password%20Manager%20V.1.2.0/generator.py">generator.py</button>
    <button data-url="https://raw.githubusercontent.com/sencesco/Application/refs/heads/main/Password%20Manager%20V.1.2.0/user_interactive.py">user_interactive.py</button>
    <button data-url="https://raw.githubusercontent.com/sencesco/Application/refs/heads/main/Password%20Manager%20V.1.2.0/main.py">main.py</button>
    <button id="copy-button">Copy</button> 
</div>
<pre class="scrollbar"><code class="language-python" id="code-display"></code></pre>
<br>


<div class="stack-container">
<div class="code-description" markdown="1">

- **generator.py:** A custom module with a function to generate passwords containing a random mix of letters, numbers, and symbols. This module is used in `main.py` and contains an object named `GenPass`, which has two methods:
    - `_init_()`: Initializes the instance variables. All characters and numbers used to generate passwords are stored in a list within this method.
    - `generate_password()`: Generates a password by randomly mixing letters, numbers, and symbols. The `random` module is used to shuffle the list and join the characters to form a password. The list is then shuffled again to further randomize the password. This method also utilizes `Tkinter` for the user interface and clears the list when generating a new password. Additionally, `pyperclip` is used to copy the password to the clipboard if desired by the user.

</div>

<div class="code-description" markdown="1">

- **user_interactive.py:** A custom module with a function to interactive with users for can manage their websites-name, usernames, and passwords. This module is used in `main.py` and contains an object named `UserInteractive`, which has methods:
    - `_init_()`: Initializes the instance variables that are used in the class.
    - `save_defaults()`: Saves the entered websites-name and usernamevalue by the user to a JSON file.
    - `load_defaults()`: Loads the previously saved websites-name and username values from the JSON file.
    - `save_file()`: Saves the entered data websites-name, username and password value by the user to a JSON file. If data already exists, it will be overwritten if the user confirms.
    -  `search_pass()`: Searches for the entered value by the user in the JSON file. if the password is found, it will be displayed to the user and automatically copied to the clipboard. If the password is not found, an error message will be displayed.
    - `clear_input()`: Clears the input fields.
    - `clear_user_data()`: Clears the user data from the JSON file.

</div>

<div class="code-description" markdown="1">

- **main.py:** The main module for the Password Manager application. This module will build upon the previous modules, including `generator.py` and `user_interactive.py`. This file will used to build the GUI for the application with the `Tkinter`, and use to run the application for debugging. In this project, it contained an object from `Tkinter`:
    - `tkinter.Tk()`: The main window for the application.
    - `tkinter.Canvas()`: For the background image.
    - `tkinter.Label()`: For the lable of the input field.
    - `tkinter.Entry()`: For the input field.
    - `tkinter.Button()`: For the buttons.
    - `tkinter.Text()`: For the output field.
    - `object.grid()`: For all the widgets to be placed in the window.

</div>
</div>


## Closing words
{{ site.tabc }} I hope this showcase gives you an understanding of how the Password Manager works and inspires you to implement similar projects. You’re now equipped to manage passwords securely!

{{ site.tabc }} If you found this project helpful, feel free to share it. Don’t forget to check out my other projects for more coding inspiration. Enjoy reading!
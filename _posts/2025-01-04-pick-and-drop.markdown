---
layout: post
title: "Pick and Drop Game RL"
excerpt: >
    Making a pick and drop game that agents can autoplay with Reinforcement Learning.
date: 2025-01-04
categories: ["AI", "ML", "Python"]
image: /assets/image/post_image/pick-and-drop_1.gif
read_time: 9
github-repo: https://github.com/sencesco/Machine-Learning/blob/main/Pick%20and%20Drop%20Game_RL.ipynb
colab-link: https://colab.research.google.com/github/sencesco/Machine-Learning/blob/main/Pick%20and%20Drop%20Game_RL.ipynb
---

<div id="c-s-hlist">
    <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#setting-up-the-game-environment">Setting up the game environmentl</a></li>
        <li><a href="#the-game-policy">The Game Policy</a></li>
        <li><a href="#source-code">Source Code</a></li>
        <li><a href="#results">Results</a></li>
        <li><a href="#challenges-and-considerations">Challenges and Considerations</a></li>
        <li><a href="#conclusion">Conclusion</a></li>
    </ul>
</div>

## Overview
&emsp;  This challenge, we will make auto pick and drop game that agent can auto reach a goal that can pick up item from pick up point and then go to drop-off point for drop the item then game will ending. So agent will learning to play with reinforcement learning, that we will compare 2 policy that is <u>Naive Random Solution</u> or <u>random walk solution</u> and <u>Q-learning algorithm</u>.


## Tech Stack
- **Programming Language:** Python3
- **Game Algorithm:** Reinforcement Learning with Python3 from scratch
- **Visualization:** Pygame
- **Version Control:** Git, GitHub


## Setting up the game environment
- The Pick and Drop Game environment are contain a field boundary and rules. field are boundary in widht * height and the rules of game are:
    - If the agent tries to go off the field, punish with -10 in reward.
    - If the agent makes a (legal) move, punish with -1 in reward, as we do not want to encourage endless walking around.
    - If the agent tries to pick up item, but it is not there or it has it already, punish with -10 in reward.
    - If the agent picks up the item correct place, reward with 20.
    - If agent tries to drop-off item in wrong place or does not have the item, punish with -10 in reward.
    - If the agent drops-off item in correct place, reward with 20.
<pre class="scrollbar-x">
<code class="language-python">
class Field:
    def __init__(self, size, item_pickup, item_dropoff, start_position):
        self.size = size  # Size of the board
        self.item_pickup = item_pickup
        self.item_dropoff = item_dropoff
        self.position = start_position
        self.item_in_car = False
    
    def get_number_of_states(self):
        # All possible state
        # We have m row * n column
        #   So posibility of picked-up = m*n
        #   Meanwhile posibility of drop-off = m*n
        #   And last check the agent have carry item or not = *2
        return self.size * self.size * self.size * self.size * 2
    
    def get_state(self):
        # Calculate Manhattan distances to goals
        dist_to_pickup = abs(self.position[0] - self.item_pickup[0]) + abs(self.position[1] - self.item_pickup[1])
        dist_to_dropoff = abs(self.position[0] - self.item_dropoff[0]) + abs(self.position[1] - self.item_dropoff[1])
        
        # Base state from position
        state = self.position[0] * self.size + self.position[1]
        
        # Add carrying state (if the item is in the car, add an offset)
        if self.item_in_car:
            state = state + (self.size * self.size)
        
        # Add distance to goals (pickup or dropoff)
        if not self.item_in_car:
            state = state * self.size + dist_to_pickup
        else:
            state = state * self.size + dist_to_dropoff
        
        return state
    
    def make_action(self, action):
        (x, y) = self.position
        
        # Actions and their corresponding rewards
        if action == 0:  # Move down
            if y == self.size - 1:
                return -10, False
            else:
                self.position = (x, y + 1)
                return -1, False
        elif action == 1:  # Move up
            if y == 0:
                return -10, False
            else:
                self.position = (x, y - 1)
                return -1, False
        elif action == 2:  # Move left
            if x == 0:
                return -10, False
            else:
                self.position = (x - 1, y)
                return -1, False
        elif action == 3:  # Move right
            if x == self.size - 1:
                return -10, False
            else:
                self.position = (x + 1, y)
                return -1, False
        elif action == 4:  # Pick-up
            if self.item_in_car or self.item_pickup != (x, y):
                return -10, False
            else:
                self.item_in_car = True
                return 20, False
        elif action == 5:  # Drop-off
            if not self.item_in_car or self.item_dropoff != (x, y):
                return -10, False
            else:
                self.item_in_car = False
                return 20, True</code>
</pre>


## The Game Policy
&emsp; As we mention before, we have 2 policy of this game as:
- **Policy 1 - Random walk:** this is Naive Random or random walk plan that each action has the same probability of being taken and not exactly the same action in each episode.
    - It's the most basic approach to reinforcement learning (RL).
    - The agent selects actions randomly, without considering past experiences or rewards.
    - It's often used as a baseline to compare against more sophisticated RL algorithms.
    - No learning: The agent doesn't learn from its actions or outcomes.
    - No strategy: There's no intentional planning or decision-making involved. Uncertain performance: Results can vary greatly depending on chance
<pre class="scrollbar-x">
<code class="language-python">import random

def random_plan(field):
    done = False
    steps = 0
    
    while not done:
        action = random.randint(0,5)
        reward, done = field.make_action(action)
        steps = steps + 1

    return steps</code>
</pre>

- **Policy 2 - Q-Learning Algorithm:** This algorithm used to find the optimal policy for an agent interacting with an environment. It learns by updating a Q-value table that estimates the expected future rewards for taking certain actions in specific states.
<pre class="scrollbar-x">
<code class="language-python">import numpy as np
from tabulate import tabulate

def q_learning_with_convergence(field, learning_rate=0.1, discount_factor=0.9, 
                                exploration_rate=0.1, max_steps=1000, max_episodes=10000,
                                convergence_threshold=0.01, window_size=100):
    size = field.size
    num_states = field.get_number_of_states()
    q_table = np.zeros((num_states, 6))  # 6 possible actions (4 move + 2 pick/drop)
    
    # Track Q-value changes
    q_value_history = []
    avg_q_changes = []
    
    def select_action(state):
        if np.random.rand() < exploration_rate:
            return np.random.choice(6)  # Random exploration
        else:
            return np.argmax(q_table[state])  # Exploit learned values
    
    def update_q_table(state, action, reward, next_state):
        old_q = q_table[state, action]
        best_next_action = np.argmax(q_table[next_state])  # Max Q for the next state
        q_table[state, action] += learning_rate * (
            reward + discount_factor * q_table[next_state, best_next_action] - old_q
        )
        return abs(old_q - q_table[state, action])
    
    episode_steps = []
    convergence_reached = False
    episode = 0
    
    # Main loop for running episodes until convergence is reached or max episodes are completed
    while not convergence_reached and episode < max_episodes:
        state = field.get_state()
        steps = 0
        q_changes = []
        
        for _ in range(max_steps):
            # Action and reward
            action = select_action(state)
            reward, done = field.make_action(action)
            next_state = field.get_state()
            
            # Track Q-value change
            q_change = update_q_table(state, action, reward, next_state)
            q_changes.append(q_change)
            
            steps += 1
            state = next_state
            
            if done:
                break
        
        # Append changed history
        episode_steps.append(steps)
        avg_q_change = np.mean(q_changes)
        q_value_history.append(avg_q_change)
        
        # Check for convergence
        if len(q_value_history) >= window_size:
            avg_change = np.mean(q_value_history[-window_size:])
            avg_q_changes.append(avg_change)
            
            # If changed history reach to convergence threshold
            if avg_change < convergence_threshold:
                convergence_reached = True
                print(f"Convergence reached after {episode + 1} episodes")
                print(f"Average steps in last {window_size} episodes: {np.mean(episode_steps[-window_size:]):.2f}")
                print(f"Final average Q-value change: {q_value_history[-1]:.6f}")
                break
        
        episode += 1
    
    return {
        'episodes_needed': episode + 1,
        'q_table': q_table,
        'episode_steps': episode_steps,
        'q_value_history': q_value_history,
        'avg_q_changes': avg_q_changes
    }</code>
</pre>
&emsp; A one important hyperparameter to to set before runnig a Q-table are number of episodes that each episode are 2 possible that is can drop the item and reach max step with can not drop the item. We can not say what a certain value that optimal number of episodes. But we can roughly optimize that where q-table is converged (the last value of q-table of last episode is same or almost same average of for example last 5 episode). So if q-table is converged Will tell us should stop episode number at here. So this mean knowing new thing that not change or can say that thing same as previous know.


## Source Code
<div class="post-content-link">
    <ul>
        <li>
        You can find all the source code on
        <a href="https://github.com/sencesco/Machine-Learning/blob/main/Pick%20and%20Drop%20Game_RL.ipynb" target="_blank" alt="GitHub-repo/Pick-and-Drop-Game_RL">
            GitHub
        </a>
        </li>
    </ul>
</div>


## Results
- **Average Steps from Random Walk:** 
<pre class="scrollbar-x">
<code class="language-python">
# Average runing step from 100 episodes
run = [random_plan(field) for _ in range(100)]
sum(run)/len(run)</code>
</pre>
<pre class="output">
554.45
</pre>

- **Average Steps from Q-Learning Algorithm:**
<pre class="scrollbar-x">
<code class="language-python">filed_size = 5

# Set up the field
field = Field(
    size=filed_size,
    item_pickup=(0, 0),
    item_dropoff=(4, 4),
    start_position=(2, 2)
)

# learning model
model = q_learning_with_convergence(field)</code>
</pre>
<pre class="output">
Convergence reached after 1593 episodes
Average steps in last 100 episodes: 20.09
Final average Q-value change: 0.000000
</pre>

&emsp; The steps of agent walking from random walk still change every time. But from the random walk we can use to guide the Q-learning algorithm, the good performance of steps from the Q-learning algorithm should be less than the random walk.

- **Simulation:** With Pygame we can see how the agent is learning to pick and drop the item. let's see how the agent is learning to pick and drop the item.
<div style="text-align: center; margin: 10px auto">
    <img src="{{ site.baseurl }}/assets/image/post_image/pick-and-drop_1.gif" alt="auto-play-pick-and-drop-animation" style="width: 75%;">
</div>

&emsp; So, when we make the agent autoplay with 10 episodes, and each episode is a different starting point, the agent can achieve a goal in all episodes even when we train with `model = q_learning_with_convergence(field)` and `field` is `start_position=(2, 2)`. This means the agent is learning properly with optimal process and hyperparameter setting, and estimation of average step in all episodes is 13 episodes that are a step closer and not over to average steps in the last 100 episodes: 20.09 in the training model.

&emsp; A stats on the right showing in episode how the agent is making an action on each action state, the action state on the Q-table value showing a reward when the agent is making an action. So, this is how an agent can learn and make a decision.


## Challenges and Considerations
- **Polycy:**  Choosing the right policy is crucial. A well-designed policy guides the agent to make decisions that lead to optimal learning and performance within the environment.
- **Exploration vs. Exploitation:** Q-learning must strike a balance between exploring new actions to discover potentially better rewards (exploration) and leveraging known actions that yield high rewards (exploitation). Too much exploration can slow learning, while too little may cause the agent to miss the optimal policy.
- **hyperparameter tuning:** The performance of Q-learning heavily depends on hyperparameters such as the learning rate (α), discount factor (γ), and exploration rate (ε). Improper tuning can lead to slow learning or convergence to suboptimal solutions.
- **Convergence:** While Q-learning is proven to converge to the optimal policy under certain conditions, in practice, it may converge slowly or get trapped in local optima—especially in complex or stochastic environments.

## Conclusion
&emsp;  So, this challenge demonstrates the implementation of the Q-learning algorithm and agent visualization, illustrating how an agent learns and takes actions based on rewards influenced by its environment. And our agent can learn to pick and drop the item and reach the goal with optimal performance. That the steps of each episode are less than the average steps in the last 100 episodes from the Q-learning algorithm with optimal hyperparameter and convergence. So, Q-learning is just one approach within the broader category of reinforcement learning algorithms; there are other methods available for enabling agents to learn effectively.

&emsp; If you found this project useful, feel free to share it, Thanks for reading!
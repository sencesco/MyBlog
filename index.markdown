---
layout: home
title: All Posts
---

{% for post in site.posts %}
<div class="project">
    <img src="{{ post.image }}" width="100" height="100">
    <h2>{{ post.title }}</h2>
    <p class="pj_tag">#
        {% for category in post.categories %}
            <a class="pj_tag" href="{{ category | downcase }}.html">{{ category }}</a>
            {% unless forloop.last %}, {% endunless %}
        {% endfor %}
    </p>
    <p class="pj_desc">{{ post.excerpt }}</p>
    <p class="pj_date_and_read">{{ post.date | date: "%b %d, %Y" }} · {{ post.read_time }} min read 
        <a class="pj_page" href="{{ site.baseurl }}{{ post.url }}" target="_blank">
            <span class="read-more">Read more</span>
        </a>
    </p>
</div>
{% endfor %}
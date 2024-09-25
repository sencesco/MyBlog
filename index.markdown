---
layout: home
title: All Posts
---

{% for post in site.posts %}
<div class="project">
    <img src="{{ site.baseurl }}{{ post.image }}" width="100" height="100">
    <h2>{{ post.title }}</h2>
    <p class="pj_tag">#
        {% for category in post.categories %}
            <a class="pj_tag" href="{{ category | downcase }}.html">{{ category }}</a>
            {% unless forloop.last %}, {% endunless %}
        {% endfor %}
    </p>
    <p class="pj_desc">{{ post.excerpt }}</p>
    <p class="pj_date_and_read">{{ post.date | date: "%b %d, %Y" }} · {{ post.read_time }} min read 
        <span class="read-more"><a class="pj_page" href="{{ post.url }}" target="_blank">Read more</a></span>
    </p>
</div>
{% endfor %}
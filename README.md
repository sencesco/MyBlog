# MyBlog

A personal Jekyll blog site to showcase projects, learnings, certifications, and technical writing.

---

## 🚀 Getting Started & Local Deployment

This project uses **Jekyll** (v4.3.4) and is set up to run locally using Ruby and Bundler.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
* **Ruby** (v3.0 or higher recommended. It is highly recommended to use the **system Ruby** instead of a Snap/Flatpak version, as Snap confinement blocks the compiler and isolates gem execution paths).
* **Development Tools** (`build-essential`, `g++`, `make`, `ruby-dev`) to compile native gem extensions (such as `bigdecimal` and `eventmachine`).

```bash
# On Ubuntu/Debian, install the compiler and system Ruby headers:
sudo apt update
sudo apt install build-essential ruby-dev
```

### 🔧 Installation Steps

To isolate the dependencies and avoid permissions errors when running `bundle install`, follow these steps:

1. **Install Bundler for the System Ruby** (using `--user-install` to avoid requiring root/sudo privileges):
   ```bash
   gem install bundler --user-install
   ```

2. **Configure Bundler to install gems locally**:
   Ensure you run this from the repository root to configure local installation paths:
   ```bash
   $(ruby -r rubygems -e 'puts Gem.user_dir')/bin/bundle config set --local path 'vendor/bundle'
   ```

3. **Install Dependencies**:
   ```bash
   $(ruby -r rubygems -e 'puts Gem.user_dir')/bin/bundle install
   ```

4. **Add User Gem Binaries to your PATH**:
   To run standard commands like `bundle` and `jekyll` directly, add the Ruby user gem directory to the beginning of your shell's `PATH`:
   ```bash
   export PATH="$(ruby -r rubygems -e 'puts Gem.user_dir')/bin:$PATH"
   ```
   *(To make this permanent, append the export line to your `~/.bashrc` or `~/.zshrc` file)*.

---

## 🛠️ Local Development & Debugging

Once your environment is set up and your `PATH` is updated, you can use the standard developer commands. 

### 🏃 Running Jekyll

* **Standard Local Deployment**:
  ```bash
  bundle exec jekyll serve
  ```
  Access the site at: **[http://localhost:4000/MyBlog/](http://localhost:4000/MyBlog/)**

* **Access From Other Devices on the Same Wi-Fi** (Responsive / Mobile Testing):
  ```bash
  bundle exec jekyll serve --host 0.0.0.0
  ```

#### 🌐 Accessing via Wi-Fi:
1. Find your machine's local IP address:
   * **Linux/WSL**: `hostname -I` or `ip addr`
   * **Windows**: `ipconfig`
2. Open your phone, tablet, or secondary device connected to the **same Wi-Fi network**.
3. Open the browser and visit: `http://<YOUR_PC_IP>:4000/MyBlog/` (e.g., `http://192.168.1.50:4000/MyBlog/`).

> [!NOTE]
> Jekyll has a configured `baseurl` of `/MyBlog` in `_config.yml`. You **must** append `/MyBlog/` to the end of the URL for links and assets to load properly.

> [!TIP]
> **Firewall Troubleshooting (Linux/Ubuntu):**
> If your mobile device still cannot connect to `http://<YOUR_PC_IP>:4000/MyBlog/` even when on the same Wi-Fi, the host firewall might be blocking incoming traffic on port `4000`. You can resolve this by allowing port `4000` through your firewall (UFW):
> ```bash
> sudo ufw allow 4000/tcp
> ```


---

## 📂 Project Structure & Guidelines for Developers

* `_posts/`: Place your blog posts here. Files must be named in the format `YYYY-MM-DD-title.markdown` and start with proper YAML front matter.
* `_certifications/`: Custom collection containing certification items and media.
* `_includes/`: HTML partials (e.g., headers, footers) that can be included in layouts.
* `_layouts/`: Page templates (e.g., `default`, `post`, `page`).
* `assets/`: Global CSS/SCSS stylesheets, JavaScript files, and images.
* `data_img/`: Media files and assets for posts/pages.
* `_config.yml`: Global configuration file (site title, description, social links, collection configs).

### 📝 Adding a New Post
1. Create a new markdown file under `_posts/` with the filename structure `YYYY-MM-DD-your-post-title.markdown`.
2. Add the YAML front matter at the top:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   date: YYYY-MM-DD HH:MM:SS +0700
   categories: [category1, category2]
   ---
   ```
3. Write your content in markdown format.

---

## 🔧 Internal Space-in-Path Fix (Under the Hood)
Normally, running `bundle exec` in a path containing spaces (e.g., `/Computer and Technology/`) crashes Ruby because the space splits the `RUBYOPT` environment paths into invalid flags (e.g. `ruby: invalid switch in RUBYOPT: -a`). 

We have patched this in the local bundler gem (`vendor/bundle/ruby/3.2.0/gems/bundler-2.5.19/lib/bundler/shared_helpers.rb`) by replacing the absolute setup path in the `set_rubyopt` method with the standard relative requiring syntax:
```ruby
# Old:
setup_require = "-r#{File.expand_path("setup", __dir__)}"
# New (Patched):
setup_require = "-rbundler/setup"
```
Because the relative require name does not contain spaces, it completely resolves the space-in-path limitation for `bundle exec` commands!

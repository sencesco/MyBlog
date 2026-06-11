# MyBlog

A personal Jekyll blog site to showcase projects, learnings, certifications, and technical writing.

---

## 🚀 Getting Started & Local Development

This project uses **Jekyll** (v4.3.4) and is set up to run locally using Ruby and Bundler.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
* **Ruby** (v3.0 or higher recommended. Use the normal system Ruby or a Ruby version manager such as `rbenv`/`asdf`. Avoid Snap/Flatpak Ruby because confinement can block compilers and isolate gem paths).
* **Development Tools** (`build-essential`, `g++`, `make`, `ruby-dev`) to compile native gem extensions (such as `bigdecimal` and `eventmachine`).

```bash
# Ubuntu/Debian:
sudo apt update
sudo apt install ruby-full build-essential ruby-dev
```

Do not use the suggested `sudo snap install ruby` fix from the terminal. Snap Ruby can cause path and compiler problems with Jekyll gems.

Verify Ruby is available before continuing:

```bash
ruby -v
gem -v
```

### 🔧 One-Time Setup

Run these steps once after installing Ruby, or again only when you change Ruby versions, delete `vendor/bundle`, delete `.bundle/config`, or update `Gemfile` / `Gemfile.lock`.

1. **Install Bundler globally for your Ruby installation**:

   ```bash
   sudo gem install bundler -v 2.5.19
   ```

   Bundler is a Ruby command-line tool. It does not normally appear as a file inside this project. This project uses Bundler through `Gemfile` and `Gemfile.lock`.

2. **Verify `bundle` is available**:

   ```bash
   bundle -v
   ```

3. **Configure this project to keep gems local**:

   Run this from the repository root:

   ```bash
   bundle config set --local path 'vendor/bundle'
   ```

   This creates `.bundle/config`. The setting is persistent on your machine, but `.bundle/` is ignored by Git, so a fresh clone may need this one-time command again.

4. **Install project dependencies from the repository root**:

   ```bash
   bundle install
   ```

After this, you do not need to run `bundle config set --local path 'vendor/bundle'` or `bundle install` every time you open VS Code.

If you cannot or do not want to install Bundler globally with `sudo`, install it only for your user instead:

```bash
gem install bundler -v 2.5.19 --user-install
export PATH="$(ruby -r rubygems -e 'puts Gem.user_dir')/bin:$PATH"
bundle -v
```

If the user-local install works, add the `export PATH=...` line to `~/.bashrc` or `~/.zshrc`, then restart VS Code.

---

## 🛠️ Daily Development

After the one-time setup is done, you should only need this when you open VS Code and start developing:

```bash
bundle exec jekyll serve
```

Access the site at: **[http://localhost:4000/MyBlog/](http://localhost:4000/MyBlog/)**

If VS Code opens a terminal where `bundle` is not found, Bundler is not installed globally for the Ruby that terminal is using, or the terminal PATH is wrong. Check:

```bash
ruby -v
gem env home
bundle -v
```

### When to Run Setup Again

Run `bundle install` again only when:

* You changed Ruby versions.
* You deleted `vendor/bundle`.
* You deleted `.bundle/config`.
* `Gemfile` or `Gemfile.lock` changed.
* Bundler says a gem is missing.

Do **not** reinstall Ruby, reinstall Bundler, or rerun all setup commands every time you open VS Code.

### Access From Other Devices on the Same Wi-Fi

For responsive/mobile testing:

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

### Troubleshooting

#### `bundle: command not found`

Bundler is not installed for the Ruby version your terminal is using, or its executable is not on `PATH`.

Run:

```bash
ruby -v
gem -v
sudo gem install bundler -v 2.5.19
bundle -v
```

If you installed Bundler with `--user-install` instead of `sudo`, then add the Ruby user gem bin directory to `PATH`:

```bash
export PATH="$(ruby -r rubygems -e 'puts Gem.user_dir')/bin:$PATH"
bundle -v
```

#### `ruby: command not found`

Ruby is not installed or the VS Code terminal cannot see it. Install Ruby first:

```bash
sudo apt update
sudo apt install ruby-full build-essential ruby-dev
```

Then restart the terminal and verify:

```bash
ruby -v
gem -v
```

#### Ruby / Bundler problems caused by spaces in this repo path

This repository lives in a path that contains spaces, for example `Computer and Technology`. Modern Ruby/Bundler setups should handle this. If `bundle exec jekyll serve` fails with an error like `ruby: invalid switch in RUBYOPT`, first try the clean setup:

```bash
bundle update --bundler
bundle install
bundle exec jekyll serve
```

If the error still happens, move the repository to a path without spaces, such as:

```bash
~/Github/MyBlog
```

Avoid patching files inside `vendor/bundle` as a normal fix. The `vendor/` directory is ignored by Git and can be recreated by `bundle install`, so manual edits there are temporary local workarounds.

<!--
Reference only: an older local workaround patched:
vendor/bundle/ruby/3.2.0/gems/bundler-2.5.19/lib/bundler/shared_helpers.rb

That is not part of the recommended setup.
-->
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

require 'fileutils'
require 'net/http'
require 'json'

# Function to calculate the read time
def calculate_read_time(content, words_per_minute = 200)
  word_count = content.split.size
  (word_count.to_f / words_per_minute).ceil
end


# Function to fetch content from a URL
def fetch_content_from_url(url)
  uri = URI(url)
  response = Net::HTTP.get(uri)
  response  # Return the raw content
rescue => e
  puts "Error fetching content from URL: #{url}, Error: #{e.message}"
  return ""
end


# Function to fetch and process the notebook content
def fetch_notebook_content(url)
  content = fetch_content_from_url(url)
  notebook = JSON.parse(content)
  markdown_content = ""
  code_content = ""
  # Iterate through notebook cells and gather markdown and code
  notebook['cells'].each do |cell|
    if cell['cell_type'] == 'markdown'
      markdown_content += cell['source'].join(' ')  # Join all markdown lines
    elsif cell['cell_type'] == 'code'
      code_content += cell['source'].join(' ')  # Join all code lines
    end
  end
  # Combine markdown and code content
  markdown_content + code_content
end


# Function to fetch .py file content
def fetch_python_file_content(url)
  fetch_content_from_url(url)
end


# Process the markdown file and include external notebook and .py content
def process_markdown_file(file_path)
  # Read the content of the markdown file
  content = File.read(file_path)
  combined_content = content
  # Fetch the notebook content if a URL exists
  notebook_url = extract_notebook_url(content)
  if notebook_url
    external_notebook_content = fetch_notebook_content(notebook_url)
    combined_content += external_notebook_content
  end

  # Fetch the Python (.py) files if any are linked in the markdown
  python_urls = extract_python_urls(content)
  python_urls.each do |py_url|
    external_python_content = fetch_python_file_content(py_url)
    combined_content += external_python_content
  end

  # Calculate read time based on combined content
  read_time = calculate_read_time(combined_content)
  # Update the read_time in the front matter (if it exists)
  new_content = content.gsub(/(read_time:\s*)\d+/, "\\1#{read_time}")
  # If read_time was not found, append it to the front matter
  unless new_content.match?(/^read_time:/)
    new_content = new_content.sub(/^---/, "---\nread_time: #{read_time}\n")
  end

  # Write back to the file
  File.write(file_path, new_content)
end


# Function to extract the notebook URL from the markdown content
def extract_notebook_url(content)
  if content.match(/<div id="notebook-content">\s*(https?:\/\/\S+)/)
    return $1  # Return the first captured group (the URL)
  end
  nil
end


# Function to extract .py file URLs from the markdown content
def extract_python_urls(content)
  urls = []
  content.scan(/<button data-url="(https?:\/\/\S+\.py)">/) do |match|
    urls << match[0]
  end
  urls
end


# Main script execution
puts "Starting read time calculation..."
Dir.glob('_posts/*.markdown') do |file_path|
  process_markdown_file(file_path)
end
puts "Read time calculation completed."
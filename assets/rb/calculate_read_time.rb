require 'json'

def fetch_notebook_content(notebook_path)
  markdown_content = ''

  begin
    file = File.read(notebook_path)
    json = JSON.parse(file)

    cells = json['cells'] || []

    cells.each do |cell|
      # Skip unwanted cells by metadata
      next if cell.dig('metadata', 'tags')&.include?('skip_read_time')

      source = cell['source'].is_a?(Array) ? cell['source'].join(' ') : cell['source'].to_s

      if cell['cell_type'] == 'markdown'
        markdown_content += source
      elsif cell['cell_type'] == 'code'
        # Optionally include code in read time calculation
        markdown_content += source
      end
    end

  rescue => e
    puts "Error reading notebook: #{notebook_path}"
    puts e.message
  end

  markdown_content
end

def calculate_read_time(text)
  words_per_minute = 200.0
  word_count = text.split.size
  (word_count / words_per_minute).ceil
end

def process_markdown_file(file_path)
  content = File.read(file_path)

  notebook_path_match = content.match(/notebook_path:\s*(.*\.ipynb)/)

  if notebook_path_match
    notebook_path = notebook_path_match[1].strip
    notebook_full_path = File.expand_path("../#{notebook_path}", __dir__)
    notebook_text = fetch_notebook_content(notebook_full_path)
    total_text = content + "\n" + notebook_text
  else
    total_text = content
  end

  read_time = calculate_read_time(total_text)
  puts "Estimated read time for #{File.basename(file_path)}: #{read_time} minute(s)"
end

# Run for all markdown posts
Dir.glob(File.expand_path("../../../_posts/*.markdown", __FILE__)).each do |file|
  puts "Processing: #{file}"
  process_markdown_file(file)
end
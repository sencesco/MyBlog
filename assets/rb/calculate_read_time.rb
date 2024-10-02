require 'fileutils'

def calculate_read_time(content, words_per_minute = 200)
    # Calculate the number of words in the content
    word_count = content.split.size

    # Calculate the read time in minutes
    (word_count.to_f / words_per_minute).ceil
end

def process_markdown_file(file_path)
    # Read the content of the file
    content = File.read(file_path)

    # Calculate read time
    read_time = calculate_read_time(content)

    # Update the read_time in the front matter (if it exists)
    new_content = content.gsub(/(read_time:\s*)\d+/, "\\1#{read_time}")

    # If read_time was not found, append it to the front matter
    unless new_content.match?(/^read_time:/)
    new_content = new_content.sub(/^---/, "---\nread_time: #{read_time}\n")
    end

    # Write back to the file
    File.write(file_path, new_content)
end

puts "Starting read time calculation..."
# Process all markdown files in the _posts directory
Dir.glob('_posts/*.markdown') do |file_path|  # Adjusted path
    process_markdown_file(file_path)
    # puts "Processed: #{file_path}"
    # puts "Word count: #{File.read(file_path).split.size}"
    # puts "Read time: #{calculate_read_time(File.read(file_path))}"
    # puts "---"
end
puts "Read time calculation completed."
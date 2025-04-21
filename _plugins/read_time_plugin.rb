require 'time'
require_relative '../assets/rb/calculate_read_time'

module Jekyll
    class ReadTimeGenerator < Generator
        safe true
        priority :low

        def generate(site)
        today = Date.today
        
        site.posts.docs.each do |post|
            file_path = post.path
            
            # Only process files that exist and were modified or created today
            if File.exist?(file_path)
            file_mtime = File.mtime(file_path).to_date
            
            if file_mtime == today
                puts "Processing #{File.basename(file_path)} - modified today"
                
                # Read file content and calculate read time
                content = File.read(file_path)
                
                # Extract post content (excluding front matter)
                if content =~ /\A---\s*\n.*?\n---\s*$\n?/m
                post_content = content.sub(/\A---\s*\n.*?\n---\s*$\n?/m, '')
                else
                post_content = content
                end
                
                # Calculate read time
                read_time = calculate_read_time(post_content)
                
                # Check for notebook content
                if post_content =~ /<div\s+id=["']notebook-content["'].*?>(.*?)<\/div>/m
                notebook_url = $1.strip
                if notebook_url.start_with?("http")
                    notebook_text = fetch_notebook_content(notebook_url)
                    notebook_read_time = calculate_read_time(notebook_text)
                    read_time += notebook_read_time
                    puts "Added #{notebook_read_time} minutes from notebook at #{notebook_url}"
                end
                end
                
                # Update the file with new read_time
                update_read_time_in_file(file_path, read_time)
                
                # Update the post data for rendering
                post.data['read_time'] = read_time
            else
                # File exists but wasn't modified today - skip processing
                puts "Skipping #{File.basename(file_path)} - not modified today"
            end
            end
        end
        end
        
        private
        
        def update_read_time_in_file(file_path, read_time)
        content = File.read(file_path)
        
        # Replace existing read_time or add it before the closing front matter
        if content.include?('read_time:')
            updated_content = content.gsub(/read_time:.*?($|\n)/, "read_time: #{read_time}")
        else
            updated_content = content.sub(/---\s*\n/, "---\nread_time: #{read_time}")
        end
        
        # Only write if changed
        if content != updated_content
            File.write(file_path, updated_content)
            puts "Updated read_time to #{read_time} in #{File.basename(file_path)}"
        end
        end
        
        def calculate_read_time(text)
        words_per_minute = 200.0
        word_count = text.split.size
        (word_count / words_per_minute).ceil
        end
        
        def fetch_notebook_content(notebook_url)
        require 'open-uri'
        require 'json'
        
        content = ''
        begin
            file = URI.open(notebook_url).read
            json = JSON.parse(file)
            cells = json['cells'] || []
            
            cells.each do |cell|
            # Skip cells tagged to be skipped
            next if cell.dig('metadata', 'tags')&.include?('skip_read_time')
            
            source = cell['source'].is_a?(Array) ? cell['source'].join(' ') : cell['source'].to_s
            
            if cell['cell_type'] == 'markdown' || cell['cell_type'] == 'code'
                content += source + "\n"
            end
            end
        rescue => e
            puts "Error reading notebook from URL: #{notebook_url}"
            puts "  #{e.message}"
        end
        
        content
        end
    end
end
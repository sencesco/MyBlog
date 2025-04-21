require 'json'
require 'open-uri'

# Calculate reading time based on word count
def calculate_read_time(text)
	words_per_minute = 200.0	# Adjust as needed but in common 200 words per minute
	word_count = text.split.size
	(word_count / words_per_minute).ceil
end

# Fetch notebook content from URL or local path
def fetch_notebook_content(notebook_path_or_url)
	markdown_content = ''
  
	begin
		file = if notebook_path_or_url.start_with?('http')
				URI.open(notebook_path_or_url).read
			else
				File.read(notebook_path_or_url)
			end
		
		json = JSON.parse(file)
		cells = json['cells'] || []
		
		cells.each do |cell|
		# Skip unwanted cells by metadata
		next if cell.dig('metadata', 'tags')&.include?('skip_read_time')
		
		source = cell['source'].is_a?(Array) ? cell['source'].join(' ') : cell['source'].to_s
		
		if cell['cell_type'] == 'markdown' || cell['cell_type'] == 'code'
			markdown_content += source + "\n"
		end
		end
	rescue => e
		puts "Error reading notebook: #{notebook_path_or_url}"
		puts e.message
	end
	
	markdown_content
end
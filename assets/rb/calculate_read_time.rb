require 'json'

module ReadTimeLogic
  def self.calculate(text)
    words = text.strip.split(/\s+/).length
    (words / 200.0).ceil # 200 wpm
  end

  def self.extract_notebook_content(notebook_path_or_url)
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
        next if cell.dig('metadata', 'tags')&.include?('skip_read_time')

        source = cell['source'].is_a?(Array) ? cell['source'].join(' ') : cell['source'].to_s

        if %w[markdown code].include?(cell['cell_type'])
          markdown_content += source + "\n"
        end
      end

    rescue => e
      puts "[ReadTime] Error reading notebook: #{notebook_path_or_url}"
      puts "  #{e.message}"
    end

    markdown_content
  end
end

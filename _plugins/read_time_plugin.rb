require 'open-uri'
require_relative '../assets/rb/calculate_read_time'

module Jekyll
  class ReadTimeGenerator < Generator
    safe true
    priority :low

    def generate(site)
      site.posts.docs.each do |post|
        content = post.content.dup
        total_read_time = ReadTimeLogic.calculate(content)

        # Look for notebook URL inside <div id="notebook-content">
        if content =~ /<div\s+id=["']notebook-content["'].*?>(.*?)<\/div>/m
          notebook_url = $1.strip
          if notebook_url.start_with?("http")
            notebook_text = ReadTimeLogic.extract_notebook_content(notebook_url)
            total_read_time += ReadTimeLogic.calculate(notebook_text)
          end
        end

        post.data['read_time'] = total_read_time
      end
    end
  end
end

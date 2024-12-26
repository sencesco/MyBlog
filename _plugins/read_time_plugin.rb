require 'time' 		# To handle date and time operations
require_relative '../assets/rb/calculate_read_time'			# _plugins/read_time_plugin.rb

module ReadTimePlugin
  class Generator < Jekyll::Generator
    def generate(site)
      today = Date.today

      site.posts.docs.each do |post|
        # Get the path of the post file
        file_path = post.path

        # Check the file's last modified time
        if File.exist?(file_path)
          file_mtime = File.mtime(file_path).to_date

          # Only calculate read time for files modified or created today
          if file_mtime == today
            calculate_read_time(post.content)
          end
        end
      end
    end
  end
end

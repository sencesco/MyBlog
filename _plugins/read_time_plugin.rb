# _plugins/read_time_plugin.rb
require_relative '../assets/rb/calculate_read_time'

module ReadTimePlugin
  class Generator < Jekyll::Generator
    def generate(site)
      site.posts.docs.each do |post|
        calculate_read_time(post.content)
      end
    end
  end
end
####
# Credit: This code is from zenspider's minitest-focus gem.
# I'm including it here until he fixes its dependencies to be
# compatible with minitest 5.
# https://github.com/seattlerb/minitest-focus
####
require "minitest/unit"

class Minitest::Test    # :nodoc:
  class Focus           # :nodoc:
    VERSION = "1.0.0"   # :nodoc:
  end

  @@filtered_names = [] # :nodoc:

  ##
  # Focus on the next test defined. Cumulative. Equivalent to
  # running with command line arg: -n /test_name|.../
  #
  #   class MyTest < MiniTest::Unit::TestCase
  #     ...
  #     focus
  #     def test_pass; ... end # this one will run
  #     ...
  #   end

  def self.focus
    meta = class << self; self; end

    meta.send :define_method, :method_added do |name|
      @@filtered_names << "#{self}##{name}"
      filter = "/^(#{@@filtered_names.join "|"})$/"

      index = ARGV.index("-n")
      unless index then
        index = ARGV.size
        ARGV << "-n"
      end

      ARGV[index + 1] = filter

      meta.send :remove_method, :method_added
    end
  end
end

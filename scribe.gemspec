# -*- encoding: utf-8 -*-
require File.expand_path('../lib/scribe-rails/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = ["Jason Chen"]
  gem.email         = ["jhchen7@gmail.com"]
  gem.description   = "Scribe rich text editor for Rails 3"
  gem.summary       = "Scribe rich text editor for Rails 3"
  gem.homepage      = "https://github.com/stypi/scribe"

  gem.files         = Dir["{lib,vendor}/**/*"] + ["README.md"]
  gem.name          = "scribe-rails"
  gem.require_paths = ["lib"]
  gem.version       = Scribe::Rails::VERSION

  gem.add_dependency "railties", "~> 3.1"
  gem.add_dependency "underscore-rails", "~> 1.4.3"
end

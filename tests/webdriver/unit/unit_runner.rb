Dir.glob(File.dirname(File.expand_path(__FILE__)) + "/*.rb").each { |f|
  require f
}

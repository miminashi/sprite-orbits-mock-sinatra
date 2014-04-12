require 'sinatra'
require "sinatra/reloader" if development?
require 'uri'
require 'open-uri'
require 'json'
require 'pp'

configure do
  mime_type :json, 'application/json'
end

get '/' do
  erb :index, :layout => nil
end
#
#get '/issue_categories.json' do
#  p params
#  #url = URI.join(SHIRASETE_BASE_URL, "/projects/#{SHIRASETE_PROJECT_ID}/issue_categories.json")
#  #url = url
#  conn = settings.faraday
#  res = conn.get("/projects/#{SHIRASETE_PROJECT_ID}/issue_categories.json", {:key => SHIRASETE_API_KEY})
#  content_type :json
#  res.body
#end
#
#get '/issues.json' do
#  puts "issues: #{params.inspect}"
#  params[:key] = SHIRASETE_API_KEY
#  params[:project_id] = SHIRASETE_PROJECT_ID
#  conn = settings.faraday
#  res = conn.get("/issues.json", params)
#  content_type :json
#  res.body
#end
#
#get '/issue/:id.json' do
#end


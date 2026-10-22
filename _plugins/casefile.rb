# Casefile for Jekyll: the pieces Hugo has built in and Jekyll doesn't.
#   - sha256 filter            (case IDs)
#   - cssmin filter            (inlined CSS)
#   - toc filter               (collapsible contents list, h2–h3)
#   - casefile_tags filter     (tags sorted by count, then name)
#   - {% artifact %} block     (evidence card, like the Hugo shortcode)
#   - /tags/<tag>/ pages       (generated, like Hugo taxonomy terms)
# No gems beyond Jekyll itself are needed.

require "digest"
require "cgi"

module Casefile
  module Filters
    def sha256(input)
      Digest::SHA256.hexdigest(input.to_s)
    end

    def cssmin(input)
      input.to_s
        .gsub(%r{/\*.*?\*/}m, "")
        .gsub(/\s+/, " ")
        .gsub(/\s*([{};,>])\s*/, '\1')
        .gsub(";}", "}")
        .strip
    end

    # Builds a nested list of h2/h3 headings that have ids, matching Hugo's
    # <nav id="TableOfContents"> output. Returns "" when there are none.
    def toc(html)
      heads = html.to_s.scan(%r{<h([23])[^>]*\bid="([^"]+)"[^>]*>(.*?)</h\1>}m)
      return "" if heads.empty?

      out = +"<nav id=\"TableOfContents\"><ul>"
      open_sub = false
      heads.each_with_index do |(level, id, text), i|
        if level == "3" && i.positive? && !open_sub
          out.sub!(%r{</li>\z}, "")
          out << "<ul>"
          open_sub = true
        elsif level == "2" && open_sub
          out << "</ul></li>"
          open_sub = false
        end
        out << "<li><a href=\"##{id}\">#{text.gsub(/<[^>]+>/, '')}</a></li>"
      end
      out << "</ul></li>" if open_sub
      out << "</ul></nav>"
    end

    def casefile_tags(tags_hash)
      (tags_hash || {}).map { |name, posts| { "name" => name, "count" => posts.size } }
        .sort_by { |t| [-t["count"], t["name"].downcase] }
    end
  end

  class ArtifactBlock < Liquid::Block
    FIELDS = [%w[path Path], %w[source Source], %w[md5 MD5], %w[sha1 SHA-1], %w[sha256 SHA-256]].freeze

    def initialize(tag_name, markup, tokens)
      super
      @attrs = markup.scan(/(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)')/).to_h { |k, a, b| [k, a || b] }
    end

    def render(context)
      esc = ->(s) { CGI.escapeHTML(s.to_s) }
      inner = super.to_s.strip
      html = +"<figure class=\"artifact\"><figcaption>#{esc.(@attrs['name'] || 'Artifact')}</figcaption><dl>"
      FIELDS.each do |key, label|
        v = @attrs[key]
        html << "<dt>#{label}</dt><dd><code>#{esc.(v)}</code></dd>" if v && !v.empty?
      end
      html << "</dl>"
      unless inner.empty?
        site = context.registers[:site]
        md = site.find_converter_instance(Jekyll::Converters::Markdown).convert(inner).strip
        md = md.sub(%r{\A<p>(.*)</p>\z}m, '\1') if md.scan("<p>").size == 1 # like Hugo's markdownify
        html << "<div class=\"artifact-notes\">#{md}</div>"
      end
      html << "</figure>"
      # nomarkdown keeps kramdown from touching the backslashes in Windows paths
      "\n{::nomarkdown}#{html}{:/}\n"
    end
  end

  class TagPage < Jekyll::PageWithoutAFile
    def initialize(site, tag)
      slug = Jekyll::Utils.slugify(tag)
      super(site, site.source, File.join("tags", slug), "index.html")
      data["layout"] = "list"
      data["term"] = tag
      data["title"] = tag.split(/[\s-]+/).map(&:capitalize).join(" ")
    end
  end

  class TagPages < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      site.tags.each_key { |tag| site.pages << TagPage.new(site, tag) }
    end
  end
end

Liquid::Template.register_filter(Casefile::Filters)
Liquid::Template.register_tag("artifact", Casefile::ArtifactBlock)

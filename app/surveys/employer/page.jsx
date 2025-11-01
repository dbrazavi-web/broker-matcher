cat > fix_calendly_final.py << 'EOF'
with open('app/surveys/employer/page.jsx', 'r') as f:
    content = f.read()

# Update top Calendly section
old_top = '''        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center mb-8">
          <p className="text-lg mb-2 text-white">
            We'll email you 3 matched broker recommendations within the next few hours.
          </p>
          <div className="h-px bg-green-500/30 my-4"></div>
          <p className="text-purple-200 mb-4">
            Want to discuss your business needs for more customized service?
          </p>
          <a 
            href="https://calendly.com/dbrazavi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Book a quick 15-minute call
          </a>
        </div>'''

new_top = '''        <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Want a More Personalized Match?</h3>
          <p className="text-purple-200 mb-6">
            Book a 15-minute call to discuss your business needs and get customized broker recommendations.
          </p>
          <a 
            href="https://calendly.com/dbrazavi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Book a 15-minute call
          </a>
          <p className="text-sm text-purple-300 mt-4">Or fill out the survey below to get instant matches</p>
        </div>'''

content = content.replace(old_top, new_top)

# Remove bottom Calendly (after matches in success page)
old_bottom = '''          <div className="mt-12 bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
            <p className="text-lg mb-2">
              We'll email you 3 matched broker recommendations within the next few hours.
            </p>
            <div className="h-px bg-green-500/30 my-4"></div>
            <p className="text-purple-200 mb-4">
              Want to discuss your business needs for more customized service?
            </p>
            <a 
              href="https://calendly.com/dbrazavi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Book a quick 15-minute call
            </a>
          </div>'''

content = content.replace(old_bottom, '')

with open('app/surveys/employer/page.jsx', 'w') as f:
    f.write(content)

print("Employer survey Calendly updated!")
EOF

python3 fix_calendly_final.py
vercel --prod
# Inject fixtures into DOM
for file,html of window.__html__
  document.body.innerHTML = document.body.innerHTML + html
